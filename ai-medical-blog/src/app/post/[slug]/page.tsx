import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { getCategory } from '@/lib/categories'
import { CategoryBadge } from '@/components/CategoryBadge'
import { mdxComponents } from '@/components/MDXComponents'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => {
    const parts = slug.split('/')
    return { slug: parts.join('/') }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug)
  const post = getPostBySlug(decodedSlug)
  if (!post) return {}

  return {
    title: `${post.title} - AI Medical News`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default function PostPage({ params }: Props) {
  const decodedSlug = decodeURIComponent(params.slug)
  const post = getPostBySlug(decodedSlug)

  if (!post) {
    notFound()
  }

  const category = getCategory(post.category)
  const formattedDate = format(new Date(post.date), "d 'de' MMMM, yyyy", {
    locale: es,
  })

  return (
    <div className="py-12">
      <article className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/categoria/${post.category}`}
                className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {category?.name || post.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-navy dark:text-white font-medium truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <CategoryBadge category={post.category} linked />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {post.pubmedId && (
            <div className="mt-4">
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${post.pubmedId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Ver en PubMed
              </a>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-image overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
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
            Volver al blog
          </Link>
        </div>
      </article>
    </div>
  )
}
