import { Metadata } from 'next'
import { getFAQ } from '@lib/data/fetch'
import FAQAccordion from '@modules/common/components/faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ | Black Eyes Artisan',
  description:
    'Frequently asked questions about Black Eyes Artisan products, shipping, returns, and more.',
}

export default async function FAQPage() {
  const faqData = await getFAQ()
  const faq = faqData?.data

  if (!faq || !faq.FAQSection || faq.FAQSection.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-8">
            Frequently Asked <span className="text-acid">Questions</span>
          </h1>
          <p className="text-lg opacity-70">Content coming soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
          Frequently Asked <span className="text-acid">Questions</span>
        </h1>
        <p className="text-lg opacity-70 mb-12">
          Find answers to common questions about our products, shipping, and policies.
        </p>

        {/* FAQ Navigation */}
        {faq.FAQSection.length > 1 && (
          <nav className="mb-12 flex flex-wrap gap-3">
            {faq.FAQSection.map((section) => (
              <a
                key={section.id}
                href={`#${section.Bookmark || section.Title.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-stone border-2 border-ink rounded-lg text-sm font-medium hover:bg-sun hover:shadow-hard transition-all"
              >
                {section.Title}
              </a>
            ))}
          </nav>
        )}

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faq.FAQSection.map((section) => (
            <section
              key={section.id}
              id={section.Bookmark || section.Title.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-24"
            >
              <h2 className="font-display font-bold text-2xl uppercase mb-6">
                <span className="text-sun">{section.Title}</span>
              </h2>
              <FAQAccordion questions={section.Question} />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
