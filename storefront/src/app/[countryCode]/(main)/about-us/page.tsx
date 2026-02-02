import { Metadata } from 'next'
import Image from 'next/image'
import { getAboutUs } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'About Us | Black Eyes Artisan',
  description:
    'Learn about Black Eyes Artisan - handcrafted glass art from Nepal. Our story, craftsmanship, and commitment to artisanal excellence.',
}

export default async function AboutUsPage() {
  const aboutData = await getAboutUs()
  const about = aboutData?.data

  if (!about) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-display text-4xl md:text-5xl uppercase mb-8">
            About <span className="text-acid">Us</span>
          </h1>
          <p className="text-lg opacity-70">Content coming soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero Banner */}
        {about.Banner && about.Banner.length > 0 && (
          <div className="relative w-full h-[300px] md:h-[400px] mb-12 rounded-lg overflow-hidden border-2 border-ink shadow-hard">
            <Image
              src={about.Banner[0].url}
              alt={about.Banner[0].alternativeText || 'Black Eyes Artisan'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-display text-4xl md:text-5xl text-paper uppercase">
                About <span className="text-acid">Us</span>
              </h1>
            </div>
          </div>
        )}

        {!about.Banner?.length && (
          <h1 className="font-display text-4xl md:text-5xl uppercase mb-12">
            About <span className="text-acid">Us</span>
          </h1>
        )}

        {/* Our Story Section */}
        {about.OurStory && (
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl uppercase mb-4">
                  <span className="text-sun">{about.OurStory.Title}</span>
                </h2>
                <div
                  className="prose prose-lg max-w-none text-ink/80"
                  dangerouslySetInnerHTML={{ __html: about.OurStory.Text }}
                />
              </div>
              {about.OurStory.Image && (
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-ink shadow-hard">
                  <Image
                    src={about.OurStory.Image.url}
                    alt={about.OurStory.Image.alternativeText || about.OurStory.Title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Our Craftsmanship Section */}
        {about.OurCraftsmanship && (
          <section className="mb-16 bg-stone/30 -mx-4 md:-mx-8 px-4 md:px-8 py-12 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {about.OurCraftsmanship.Image && (
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-ink shadow-hard order-2 md:order-1">
                  <Image
                    src={about.OurCraftsmanship.Image.url}
                    alt={
                      about.OurCraftsmanship.Image.alternativeText ||
                      about.OurCraftsmanship.Title
                    }
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="order-1 md:order-2">
                <h2 className="font-display text-3xl uppercase mb-4">
                  <span className="text-acid">{about.OurCraftsmanship.Title}</span>
                </h2>
                <div
                  className="prose prose-lg max-w-none text-ink/80"
                  dangerouslySetInnerHTML={{ __html: about.OurCraftsmanship.Text }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Why Us Section */}
        {about.WhyUs && about.WhyUs.Tile && about.WhyUs.Tile.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-3xl uppercase mb-8 text-center">
              <span className="text-sun">{about.WhyUs.Title}</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {about.WhyUs.Tile.map((tile) => (
                <div
                  key={tile.id}
                  className="bg-paper border-2 border-ink rounded-lg p-6 shadow-hard hover:shadow-hard-xl transition-shadow"
                >
                  {tile.Image && (
                    <div className="relative w-16 h-16 mb-4">
                      <Image
                        src={tile.Image.url}
                        alt={tile.Image.alternativeText || tile.Title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-xl mb-2">{tile.Title}</h3>
                  <p className="text-sm text-ink/70">{tile.Text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Numbers/Stats Section */}
        {about.Numbers && about.Numbers.length > 0 && (
          <section className="bg-ink text-paper -mx-4 md:-mx-8 px-4 md:px-8 py-12 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {about.Numbers.map((stat) => (
                <div key={stat.id}>
                  <div className="font-display text-4xl md:text-5xl text-sun mb-2">
                    {stat.Title}
                  </div>
                  <div className="text-sm opacity-70">{stat.Text}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
