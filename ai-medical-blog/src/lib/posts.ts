import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Post, PostMeta, PostFrontmatter, CategorySlug } from '@/types'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getPostSlugs(): string[] {
  const slugs: string[] = []
  const categories = fs.readdirSync(postsDirectory)

  for (const category of categories) {
    const categoryPath = path.join(postsDirectory, category)
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath)
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          slugs.push(`${category}/${file.replace(/\.mdx$/, '')}`)
        }
      }
    }
  }

  return slugs
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const [category, fileName] = slug.split('/')
    const fullPath = path.join(postsDirectory, category, `${fileName}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const frontmatter = data as PostFrontmatter

    return {
      ...frontmatter,
      slug,
      content,
      readingTime: readingTime(content).text.replace('read', 'lectura'),
    }
  } catch {
    return null
  }
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug)
      if (!post) return null
      const { content, ...meta } = post
      return meta as PostMeta
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostsByCategory(category: CategorySlug): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getRecentPosts(limit: number = 6): PostMeta[] {
  return getAllPosts().slice(0, limit)
}

export function searchPosts(query: string): PostMeta[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
}
