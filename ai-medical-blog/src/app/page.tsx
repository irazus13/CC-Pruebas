'use client'

import { useState, useEffect, useMemo } from 'react'
import { PostList } from '@/components/PostList'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { PostMeta, CategorySlug } from '@/types'

async function fetchPosts(): Promise<PostMeta[]> {
  const res = await fetch('/api/posts', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const filteredPosts = useMemo(() => {
    let result = posts

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
  }, [posts, selectedCategory, searchQuery])

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-card p-4 animate-pulse"
              >
                <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 rounded-image mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28" />
              </div>
            ))}
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>
    </div>
  )
}
