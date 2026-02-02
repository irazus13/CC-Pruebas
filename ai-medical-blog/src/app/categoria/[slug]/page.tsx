import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostList } from '@/components/PostList'
import { getPostsByCategory } from '@/lib/posts'
import { getCategory, categoryList } from '@/lib/categories'
import { CategorySlug } from '@/types'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return categoryList.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory(params.slug as CategorySlug)
  if (!category) return {}

  return {
    title: `${category.name} - AI Medical News`,
    description: category.description,
  }
}

export default function CategoryPage({ params }: Props) {
  const category = getCategory(params.slug as CategorySlug)

  if (!category) {
    notFound()
  }

  const posts = getPostsByCategory(params.slug as CategorySlug)

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-navy dark:text-white font-medium">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-block w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: category.color }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {category.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>

        {/* Posts Grid */}
        <PostList posts={posts} />

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </div>
  )
}
