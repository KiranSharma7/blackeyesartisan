import { Metadata } from 'next'
import { getContentPage } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Black Eyes Artisan',
  description:
    'Terms and conditions for using Black Eyes Artisan store and services.',
}

export default async function TermsPage() {
  const pageData = await getContentPage('terms-and-condition', 'terms-and-conditions')
  const page = pageData?.data

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display text-4xl md:text-5xl uppercase mb-8">
          Terms & <span className="text-acid">Conditions</span>
        </h1>

        {/* Content */}
        {page?.PageContent ? (
          <div
            className="prose prose-lg max-w-none text-ink/80"
            dangerouslySetInnerHTML={{ __html: page.PageContent }}
          />
        ) : (
          <div className="text-lg opacity-70">
            <p className="mb-4">
              Welcome to Black Eyes Artisan. By using our website and services, you agree to the following terms and conditions.
            </p>
            <p>
              This page will be updated soon with our complete terms of service.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
