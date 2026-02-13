import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Map Strapi model names to ISR cache tags
const MODEL_TAG_MAP: Record<string, string[]> = {
  // Blog content
  'blog': ['blog', 'explore-blog', 'blog-slugs'],
  'blog-post-category': ['blog', 'blog-categories'],
  // Homepage content
  'homepage': ['mid-banner'],
  // About & FAQ
  'about-us': ['about-us'],
  'faq': ['faq'],
  // Policy pages
  'privacy-policy': ['privacy-policy'],
  'terms-and-condition': ['terms-and-conditions'],
  'shipping-policy': ['shipping-policy'],
  'returns-policy': ['returns-policy'],
  // Collections
  'collection': ['collections-main'],
  // Global settings (affects multiple areas)
  'global-setting': ['global-settings', 'navigation'],
  // Product variants
  'product-variants-color': ['variants-colors'],
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const body = await request.json()

  if (secret !== process.env.STRAPI_WEBHOOK_REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const model = body.model as string
    const tags = MODEL_TAG_MAP[model]

    if (!tags) {
      return NextResponse.json({
        message: 'No revalidation needed',
        model,
      })
    }

    // Revalidate all tags associated with this model
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 })
    }

    // If it's a blog post, also revalidate the specific post tag
    if (model === 'blog' && body.entry?.Slug) {
      revalidateTag(`blog-${body.entry.Slug}`, { expire: 0 })
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      model,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Strapi revalidation error:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
