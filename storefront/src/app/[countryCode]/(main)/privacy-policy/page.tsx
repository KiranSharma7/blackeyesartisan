import { Metadata } from 'next'
import { getContentPage } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'Privacy Policy | Black Eyes Artisan',
  description:
    'Privacy policy for Black Eyes Artisan - how we collect, use, and protect your personal information.',
}

export default async function PrivacyPolicyPage() {
  const pageData = await getContentPage('privacy-policy', 'privacy-policy')
  const page = pageData?.data

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-8">
          Privacy <span className="text-acid">Policy</span>
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
              At Black Eyes Artisan, we value your privacy and are committed to protecting your personal information.
            </p>
            <p>
              This policy will be updated soon with detailed information about how we collect, use, and safeguard your data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
