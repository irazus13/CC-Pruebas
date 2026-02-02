import Link from 'next/link'
import Image from 'next/image'
import { PostMeta } from '@/types'
import { CategoryBadge } from './CategoryBadge'
import { getCategoryColor } from '@/lib/categories'

interface Props {
  post: PostMeta
}

export function PostCard({ post }: Props) {
  const categoryColor = getCategoryColor(post.category)

  return (
    <article className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] rounded-image overflow-hidden mb-4">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <svg
                className="w-16 h-16 opacity-40"
                style={{ color: categoryColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="mb-3">
        <CategoryBadge category={post.category} linked />
      </div>

      <Link href={`/post/${post.slug}`}>
        <h2 className="text-lg font-bold text-navy dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>

      <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
        {post.readingTime}
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
        {post.description}
      </p>

      <Link
        href={`/post/${post.slug}`}
        className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
      >
        Leer más
      </Link>
    </article>
  )
}
