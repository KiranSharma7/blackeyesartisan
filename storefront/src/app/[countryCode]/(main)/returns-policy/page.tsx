import { Metadata } from 'next'
import { getContentPage } from '@lib/data/fetch'

export const metadata: Metadata = {
  title: 'Returns Policy | Black Eyes Artisan',
  description:
    'Returns and exchange policy for Black Eyes Artisan products.',
}

export default async function ReturnsPolicyPage() {
  const pageData = await getContentPage('returns-policy', 'returns-policy')
  const page = pageData?.data

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-8">
          Returns <span className="text-acid">Policy</span>
        </h1>

        {/* Content */}
        {page?.PageContent ? (
          <div
            className="prose prose-lg max-w-none text-ink/80"
            dangerouslySetInnerHTML={{ __html: page.PageContent }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-ink/80">
            <h2>Handcrafted with Care</h2>
            <p>
              Each Black Eyes Artisan piece is handcrafted by skilled artisans in Nepal.
              Due to the nature of our handmade products, slight variations in color, size,
              and pattern are normal and part of what makes each piece unique.
            </p>

            <h2>Damaged Items</h2>
            <p>
              If your item arrives damaged, please contact us within 48 hours of delivery
              at hello@blackeyesartisan.shop with photos of the damage. We will work with
              you to resolve the issue promptly.
            </p>

            <h2>Exchanges</h2>
            <p>
              We understand that sometimes things don't work out. If you're not satisfied
              with your purchase, please reach out to us within 14 days of receiving your
              order to discuss exchange options.
            </p>
            <p>
              Items must be unused, in their original packaging, and in the same condition
              that you received them.
            </p>

            <h2>Refunds</h2>
            <p>
              Due to the handcrafted nature of our products, we generally do not offer
              refunds unless an item arrives damaged or defective. Each case will be
              evaluated individually.
            </p>

            <h2>Return Shipping</h2>
            <p>
              Customers are responsible for return shipping costs unless the item arrived
              damaged or we made an error with your order.
            </p>

            <h2>Questions?</h2>
            <p>
              If you have any questions about returns or exchanges, please contact us at
              hello@blackeyesartisan.shop and we'll be happy to help.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
