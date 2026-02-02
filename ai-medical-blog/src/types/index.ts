export type CategorySlug =
  | 'ia-odontologia'
  | 'ia-medicina'
  | 'ia-radiologia'
  | 'investigacion'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  color: string
  pubmedTerms: string[]
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  category: CategorySlug
  image?: string
  author?: string
  pubmedId?: string
  tags?: string[]
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
  readingTime: string
}

export interface PostMeta extends PostFrontmatter {
  slug: string
  readingTime: string
}

export interface PubMedArticle {
  pmid: string
  title: string
  abstract: string
  authors: string[]
  publicationDate: string
  journal: string
  doi?: string
  keywords?: string[]
}

export interface PubMedSearchResult {
  count: number
  ids: string[]
}
