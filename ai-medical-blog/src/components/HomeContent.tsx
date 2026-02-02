'use client'

import { useState, useMemo } from 'react'
import { PostList } from '@/components/PostList'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { PostMeta, CategorySlug } from '@/types'

interface Props {
  initialPosts: PostMeta[]
}

export function HomeContent({ initialPosts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    let result = initialPosts

    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [initialPosts, selectedCategory, searchQuery])

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Últimas noticias e investigaciones sobre inteligencia artificial
            aplicada a la medicina y odontología
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Posts Grid */}
        <PostList posts={filteredPosts} />

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron artículos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
