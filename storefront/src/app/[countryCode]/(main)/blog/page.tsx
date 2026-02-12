import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPosts } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'Blog | Black Eyes Artisan',
  description:
    'Stories, insights, and updates from Black Eyes Artisan. Learn about our craft and artisan community.',
}

interface BlogPageProps {
  params: Promise<{ countryCode: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { countryCode } = await params
  const blogData = await getBlogPosts({ sortBy: 'createdAt:desc' })
  const posts = blogData?.data

  if (!posts || posts.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-8">
            Our <span className="text-acid">Blog</span>
          </h1>
          <p className="text-lg opacity-70">New stories coming soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-site mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
          Our <span className="text-acid">Blog</span>
        </h1>
        <p className="text-lg opacity-70 mb-12">
          Stories, insights, and updates from the studio.
        </p>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.Slug}
              href={`/${countryCode}/blog/${post.Slug}`}
              className="group block bg-paper border-2 border-ink rounded-lg overflow-hidden shadow-hard hover:shadow-hard-xl transition-shadow"
            >
              {post.FeaturedImage?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.FeaturedImage.url}
                    alt={post.FeaturedImage.alternativeText || post.Title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="text-xs text-ink/50 uppercase tracking-wider">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="font-display text-xl mt-2 group-hover:text-acid transition-colors">
                  {post.Title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
