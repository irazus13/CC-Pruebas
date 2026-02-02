import fs from 'fs'
import path from 'path'
import { categories } from '../src/lib/categories'
import { CategorySlug, PubMedArticle } from '../src/types'

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const API_KEY = process.env.PUBMED_API_KEY || ''
const POSTS_DIR = path.join(process.cwd(), 'content/posts')

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function searchPubMed(term: string, maxResults: number = 5): Promise<string[]> {
  const params = new URLSearchParams({
    db: 'pubmed',
    term: `${term} AND (2024[pdat] OR 2025[pdat] OR 2026[pdat])`,
    retmax: maxResults.toString(),
    retmode: 'json',
    sort: 'date',
    ...(API_KEY && { api_key: API_KEY }),
  })

  const response = await fetch(`${BASE_URL}/esearch.fcgi?${params}`)
  const data = await response.json()
  return data.esearchresult?.idlist || []
}

async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return []

  const params = new URLSearchParams({
    db: 'pubmed',
    id: pmids.join(','),
    retmode: 'xml',
    rettype: 'abstract',
    ...(API_KEY && { api_key: API_KEY }),
  })

  const response = await fetch(`${BASE_URL}/efetch.fcgi?${params}`)
  const xml = await response.text()

  return parseArticlesXML(xml)
}

function parseArticlesXML(xml: string): PubMedArticle[] {
  const articles: PubMedArticle[] = []
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []

  for (const articleXml of articleMatches) {
    try {
      const pmid = extractTag(articleXml, 'PMID') || ''
      const title = extractTag(articleXml, 'ArticleTitle') || 'Sin título'
      const abstract = extractAbstract(articleXml)
      const authors = extractAuthors(articleXml)
      const publicationDate = extractPublicationDate(articleXml)
      const journal = extractTag(articleXml, 'Title') || ''
      const doi = extractDOI(articleXml)
      const keywords = extractKeywords(articleXml)

      if (abstract.length > 100) {
        articles.push({
          pmid,
          title: cleanText(title),
          abstract: cleanText(abstract),
          authors,
          publicationDate,
          journal: cleanText(journal),
          doi,
          keywords,
        })
      }
    } catch (error) {
      console.error('Error parsing article:', error)
    }
  }

  return articles
}

function extractTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  return match ? match[1].trim() : null
}

function extractAbstract(xml: string): string {
  const abstractMatch = xml.match(/<Abstract>[\s\S]*?<\/Abstract>/)
  if (!abstractMatch) return ''

  const abstractTexts = abstractMatch[0].match(/<AbstractText[^>]*>[\s\S]*?<\/AbstractText>/g) || []
  return abstractTexts
    .map((text) => {
      const label = text.match(/Label="([^"]+)"/)
      const content = text.replace(/<[^>]+>/g, '').trim()
      return label ? `**${label[1]}:** ${content}` : content
    })
    .join('\n\n')
}

function extractAuthors(xml: string): string[] {
  const authors: string[] = []
  const authorMatches = xml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || []

  for (const authorXml of authorMatches.slice(0, 5)) {
    const lastName = extractTag(authorXml, 'LastName')
    const foreName = extractTag(authorXml, 'ForeName')
    if (lastName) {
      authors.push(foreName ? `${foreName} ${lastName}` : lastName)
    }
  }

  return authors
}

function extractPublicationDate(xml: string): string {
  const pubDateMatch = xml.match(/<PubDate>[\s\S]*?<\/PubDate>/)
  if (!pubDateMatch) return new Date().toISOString().split('T')[0]

  const year = extractTag(pubDateMatch[0], 'Year') || new Date().getFullYear().toString()
  const month = extractTag(pubDateMatch[0], 'Month') || '01'
  const day = extractTag(pubDateMatch[0], 'Day') || '01'

  const monthNum = isNaN(parseInt(month))
    ? new Date(`${month} 1, 2000`).getMonth() + 1
    : parseInt(month)

  return `${year}-${String(monthNum).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`
}

function extractDOI(xml: string): string | undefined {
  const doiMatch = xml.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/)
  return doiMatch ? doiMatch[1] : undefined
}

function extractKeywords(xml: string): string[] {
  const keywords: string[] = []
  const keywordMatches = xml.match(/<Keyword[^>]*>([^<]+)<\/Keyword>/g) || []

  for (const kw of keywordMatches.slice(0, 10)) {
    const content = kw.replace(/<[^>]+>/g, '').trim()
    if (content) keywords.push(content)
  }

  return keywords
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '')
}

function createMDXContent(article: PubMedArticle, category: CategorySlug): string {
  const slug = createSlug(article.title)
  const description = article.abstract.substring(0, 250).replace(/\*\*[^*]+:\*\*\s*/g, '') + '...'

  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
date: "${article.publicationDate}"
category: "${category}"
pubmedId: "${article.pmid}"
author: "${article.authors.slice(0, 3).join(', ')}${article.authors.length > 3 ? ' et al.' : ''}"
tags: [${(article.keywords || []).slice(0, 5).map(k => `"${k}"`).join(', ')}]
---`

  const content = `
## Resumen

${article.abstract}

## Información del artículo

- **Revista:** ${article.journal}
- **Fecha de publicación:** ${article.publicationDate}
- **Autores:** ${article.authors.join(', ')}
${article.doi ? `- **DOI:** [${article.doi}](https://doi.org/${article.doi})` : ''}
- **PubMed ID:** [${article.pmid}](https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/)

## Referencias

Este artículo fue obtenido automáticamente desde [PubMed](https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/), la base de datos de literatura biomédica del National Center for Biotechnology Information (NCBI).
`

  return frontmatter + '\n' + content
}

function getExistingPmids(categoryDir: string): Set<string> {
  const pmids = new Set<string>()

  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
    return pmids
  }

  const files = fs.readdirSync(categoryDir)
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(path.join(categoryDir, file), 'utf-8')
      const pmidMatch = content.match(/pubmedId:\s*"(\d+)"/)
      if (pmidMatch) {
        pmids.add(pmidMatch[1])
      }
    }
  }

  return pmids
}

async function fetchAndSaveArticles(): Promise<void> {
  console.log('🔬 Iniciando búsqueda de artículos en PubMed...\n')

  let totalNew = 0
  let totalSkipped = 0

  for (const [slug, category] of Object.entries(categories)) {
    console.log(`\n📁 Categoría: ${category.name}`)
    const categoryDir = path.join(POSTS_DIR, slug)
    const existingPmids = getExistingPmids(categoryDir)

    console.log(`   Artículos existentes: ${existingPmids.size}`)

    const allPmids: string[] = []

    for (const term of category.pubmedTerms) {
      console.log(`   🔍 Buscando: "${term}"`)
      const pmids = await searchPubMed(term, 3)
      allPmids.push(...pmids.filter(id => !existingPmids.has(id)))
      await delay(API_KEY ? 100 : 400)
    }

    const uniquePmids = Array.from(new Set(allPmids)).slice(0, 5)

    if (uniquePmids.length === 0) {
      console.log(`   ⏭️  No hay artículos nuevos`)
      continue
    }

    console.log(`   📥 Descargando ${uniquePmids.length} artículos nuevos...`)
    const articles = await fetchArticleDetails(uniquePmids)
    await delay(API_KEY ? 100 : 400)

    for (const article of articles) {
      const articleSlug = createSlug(article.title)
      const filePath = path.join(categoryDir, `${articleSlug}.mdx`)

      if (fs.existsSync(filePath)) {
        totalSkipped++
        continue
      }

      const mdxContent = createMDXContent(article, slug as CategorySlug)
      fs.writeFileSync(filePath, mdxContent, 'utf-8')
      console.log(`   ✅ ${article.title.substring(0, 50)}...`)
      totalNew++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ Proceso completado`)
  console.log(`   Nuevos artículos: ${totalNew}`)
  console.log(`   Omitidos (duplicados): ${totalSkipped}`)
}

fetchAndSaveArticles().catch(console.error)
