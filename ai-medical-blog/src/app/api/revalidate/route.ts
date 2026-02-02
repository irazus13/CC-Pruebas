import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    revalidatePath('/')
    revalidatePath('/categoria/[slug]', 'page')
    revalidatePath('/post/[slug]', 'page')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error },
      { status: 500 }
    )
  }
}
