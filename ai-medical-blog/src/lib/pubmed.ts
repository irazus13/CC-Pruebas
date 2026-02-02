import { PubMedArticle, PubMedSearchResult } from '@/types'

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const API_KEY = process.env.PUBMED_API_KEY || ''

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function searchPubMed(
  term: string,
  maxResults: number = 10
): Promise<PubMedSearchResult> {
  const params = new URLSearchParams({
    db: 'pubmed',
    term: term,
    retmax: maxResults.toString(),
    retmode: 'json',
    sort: 'date',
    ...(API_KEY && { api_key: API_KEY }),
  })

  const response = await fetch(`${BASE_URL}/esearch.fcgi?${params}`)
  const data = await response.json()

  return {
    count: parseInt(data.esearchresult?.count || '0'),
    ids: data.esearchresult?.idlist || [],
  }
}

export async function fetchArticleDetails(
  pmids: string[]
): Promise<PubMedArticle[]> {
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
      return label ? `${label[1]}: ${content}` : content
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

  return `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
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

export async function fetchArticlesForCategory(
  terms: string[],
  maxPerTerm: number = 3
): Promise<PubMedArticle[]> {
  const allArticles: PubMedArticle[] = []
  const seenPmids = new Set<string>()

  for (const term of terms) {
    try {
      const searchResult = await searchPubMed(term, maxPerTerm)
      await delay(API_KEY ? 100 : 334) // Rate limiting

      const newIds = searchResult.ids.filter((id) => !seenPmids.has(id))
      if (newIds.length > 0) {
        const articles = await fetchArticleDetails(newIds)
        await delay(API_KEY ? 100 : 334)

        for (const article of articles) {
          if (!seenPmids.has(article.pmid)) {
            seenPmids.add(article.pmid)
            allArticles.push(article)
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching articles for term "${term}":`, error)
    }
  }

  return allArticles
}
