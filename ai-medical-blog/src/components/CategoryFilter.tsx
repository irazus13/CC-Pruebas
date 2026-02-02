'use client'

import { CategorySlug } from '@/types'
import { categoryList } from '@/lib/categories'

interface Props {
  selected: CategorySlug | 'all'
  onChange: (category: CategorySlug | 'all') => void
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onChange('all')}
        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
          selected === 'all'
            ? 'bg-primary text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
        }`}
      >
        Todos
      </button>

      {categoryList.map((category) => (
        <button
          key={category.slug}
          onClick={() => onChange(category.slug)}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            selected === category.slug
              ? 'bg-primary text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
