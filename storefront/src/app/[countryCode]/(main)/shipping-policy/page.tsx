import { Metadata } from 'next'
import { getContentPage, getGlobalSettings } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'Shipping Policy | Black Eyes Artisan',
  description:
    'Shipping information for Black Eyes Artisan - delivery times, rates, and international shipping details.',
}

export default async function ShippingPolicyPage() {
  const [pageData, settingsData] = await Promise.all([
    getContentPage('shipping-policy', 'shipping-policy'),
    getGlobalSettings(),
  ])

  const page = pageData?.data
  const settings = settingsData?.data

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-8">
          Shipping <span className="text-acid">Policy</span>
        </h1>

        {/* Quick Info Box */}
        {settings && (
          <div className="bg-stone/30 border-2 border-ink rounded-lg p-6 mb-12 shadow-hard">
            <h2 className="font-display text-xl mb-4">Quick Info</h2>
            <ul className="space-y-3 text-ink/80">
              <li className="flex items-start">
                <span className="text-sun mr-3">•</span>
                <span>
                  <strong>Handling Time:</strong> {settings.handlingTimeDays || '3-5'} business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-sun mr-3">•</span>
                <span>
                  <strong>International Orders:</strong> {settings.dutiesDisclaimer || 'Duties and taxes are the responsibility of the buyer.'}
                </span>
              </li>
              {settings.shippingPolicyNote && (
                <li className="flex items-start">
                  <span className="text-sun mr-3">•</span>
                  <span>{settings.shippingPolicyNote}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Content */}
        {page?.PageContent ? (
          <div
            className="prose prose-lg max-w-none text-ink/80"
            dangerouslySetInnerHTML={{ __html: page.PageContent }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-ink/80">
            <h2>Processing Time</h2>
            <p>
              All orders are processed within {settings?.handlingTimeDays || '3-5'} business days after payment confirmation.
              During peak seasons or sales events, processing times may be slightly longer.
            </p>

            <h2>Domestic Shipping (USA)</h2>
            <p>
              We ship via FedEx for all domestic orders. Standard shipping typically takes 3-7 business days
              after your order has been processed and shipped.
            </p>

            <h2>International Shipping</h2>
            <p>
              We ship worldwide! International orders are shipped via FedEx International and typically
              take 7-21 business days depending on the destination.
            </p>
            <p>
              <strong>Important:</strong> {settings?.dutiesDisclaimer || 'International customers are responsible for any duties, taxes, or customs fees that may be charged by their country.'}
            </p>

            <h2>Tracking Your Order</h2>
            <p>
              Once your order ships, you will receive a confirmation email with a FedEx tracking number.
              You can use this number to track your package at fedex.com.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have any questions about shipping, please contact us at hello@blackeyesartisan.shop
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
