import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/retroui/Card'
import DutiesDisclaimer from '../duties-disclaimer'

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart
  dutiesDisclaimer?: string | null
}

export default function CheckoutSummary({
  cart,
  dutiesDisclaimer,
}: CheckoutSummaryProps) {
  const items = cart.items || []
  const subtotal = cart.subtotal || 0
  const shippingTotal = cart.shipping_total || 0
  const taxTotal = cart.tax_total || 0
  const total = cart.total || 0
  const currencyCode = cart.currency_code || 'usd'

  // Check if shipping is to an international address (non-US)
  const isInternationalOrder =
    cart.shipping_address?.country_code &&
    cart.shipping_address.country_code.toLowerCase() !== 'us'

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-ink/5 border-2 border-ink rounded-xl overflow-hidden relative flex-shrink-0">
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title || 'Product'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm uppercase truncate">
                  {item.title}
                </p>
                <p className="text-xs text-ink/60">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">
                {convertToLocale({
                  amount: item.subtotal || 0,
                  currency_code: currencyCode,
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-ink/20 my-4"></div>

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold">
              {convertToLocale({
                amount: subtotal,
                currency_code: currencyCode,
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold">
              {shippingTotal === 0
                ? 'Calculated next'
                : convertToLocale({
                    amount: shippingTotal,
                    currency_code: currencyCode,
                  })}
            </span>
          </div>
          {taxTotal > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-bold">
                {convertToLocale({
                  amount: taxTotal,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-ink/20 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="font-display">
              {convertToLocale({
                amount: total,
                currency_code: currencyCode,
              })}
            </span>
          </div>
        </div>

        {/* Duties Disclaimer - Show for international orders or always as info */}
        <DutiesDisclaimer
          disclaimerText={dutiesDisclaimer}
          title={isInternationalOrder ? 'International Shipping' : 'International Orders'}
        />
      </CardContent>
    </Card>
  )
}
