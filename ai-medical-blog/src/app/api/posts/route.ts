import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  try {
    const posts = getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error loading posts:', error)
    return NextResponse.json(
      { error: 'Failed to load posts', details: String(error) },
      { status: 500 }
    )
  }
}
