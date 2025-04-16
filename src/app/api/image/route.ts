import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    console.log('\n[Image API] Processing request for image:', imageUrl)

    if (!imageUrl) {
      console.error('\n[Image API] No image URL provided')
      return new NextResponse('Missing image URL', { status: 400 })
    }

    console.log('\n[Image API] Fetching image...')
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      console.error('\n[Image API] Failed to fetch image:', response.statusText)
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const contentType = response.headers.get('Content-Type')
    console.log('\n[Image API] Image fetched successfully:', { contentType })
    
    const blob = await response.blob()

    console.log('\n[Image API] Returning image response')
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('\n[Image API] Error:', error)
    return new NextResponse('Failed to load image', { status: 500 })
  }
} 