import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const imagePath = join(process.cwd(), 'public', 'bg-image.png')
    const imageBuffer = readFileSync(imagePath)
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
