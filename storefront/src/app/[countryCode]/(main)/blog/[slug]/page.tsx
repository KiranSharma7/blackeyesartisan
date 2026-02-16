import { cache } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogSlugs } from '@lib/data/fetch'

interface BlogPostPageProps {
  params: Promise<{ countryCode: string; slug: string }>
}

const getBlogPostPageData = cache(async (slug: string) => {
  return getBlogPostBySlug(slug)
})

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostPageData(slug)

  if (!post) {
    return {
      title: 'Post Not Found | Black Eyes Artisan',
    }
  }

  return {
    title: `${post.Title} | Black Eyes Artisan Blog`,
    description: post.Content?.substring(0, 160).replace(/<[^>]*>/g, '') || undefined,
    openGraph: {
      title: post.Title,
      images: post.FeaturedImage?.url ? [post.FeaturedImage.url] : undefined,
    },
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    // Return empty array if Strapi is unavailable during build
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { countryCode, slug } = await params
  const post = await getBlogPostPageData(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Back Link */}
        <Link
          href={`/${countryCode}/blog`}
          className="inline-flex items-center text-sm text-ink/60 hover:text-acid transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <time className="text-sm text-ink/50 uppercase tracking-wider">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mt-2 mb-4">
            {post.Title}
          </h1>
        </header>

        {/* Featured Image */}
        {post.FeaturedImage?.url && (
          <div className="relative aspect-video mb-12 rounded-xl overflow-hidden border-2 border-ink shadow-hard">
            <Image
              src={post.FeaturedImage.url}
              alt={post.FeaturedImage.alternativeText || post.Title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-ink/80"
          dangerouslySetInnerHTML={{ __html: post.Content }}
        />
      </div>
    </article>
  )
}
