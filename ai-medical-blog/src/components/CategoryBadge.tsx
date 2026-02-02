import Link from 'next/link'
import { CategorySlug } from '@/types'
import { getCategory } from '@/lib/categories'

interface Props {
  category: CategorySlug
  linked?: boolean
}

export function CategoryBadge({ category, linked = false }: Props) {
  const categoryData = getCategory(category)
  const name = categoryData?.name || category

  const badge = (
    <span className="inline-block px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
      {name}
    </span>
  )

  if (linked) {
    return (
      <Link
        href={`/categoria/${category}`}
        className="hover:opacity-80 transition-opacity"
      >
        {badge}
      </Link>
    )
  }

  return badge
}
