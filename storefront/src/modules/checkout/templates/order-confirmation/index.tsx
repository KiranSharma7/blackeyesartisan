import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderConfirmationProps {
  order: HttpTypes.StoreOrder
  countryCode: string
}

export default function OrderConfirmation({
  order,
  countryCode,
}: OrderConfirmationProps) {
  const items = order.items || []
  const subtotal = order.subtotal || 0
  const shippingTotal = order.shipping_total || 0
  const total = order.total || 0
  const currencyCode = order.currency_code || 'usd'

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div
        className="w-20 h-20 bg-acid text-white rounded-full border-2 border-ink
                    mx-auto mb-8 flex items-center justify-center shadow-hard"
      >
        <Check className="w-10 h-10" />
      </div>

      <h1 className="font-display text-4xl uppercase mb-4">Order Confirmed!</h1>
      <p className="text-lg text-ink/60 mb-2">Order #{order.display_id}</p>
      <p className="text-sm text-ink/60 mb-8">
        Confirmation sent to {order.email}
      </p>

      {/* Order Items */}
      <Card className="text-left mb-8">
        <CardContent className="p-6">
          <h2 className="font-display text-xl mb-4">Order Details</h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-stone/20 border-2 border-ink rounded-lg overflow-hidden relative flex-shrink-0">
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
                <div className="flex-1">
                  <p className="font-display text-sm uppercase">{item.title}</p>
                  <p className="text-xs text-ink/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">
                  {convertToLocale({
                    amount: item.subtotal || 0,
                    currency_code: currencyCode,
                  })}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-ink/20 my-4"></div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-bold">
                {convertToLocale({
                  amount: subtotal,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="font-bold">
                {convertToLocale({
                  amount: shippingTotal,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
            <div className="flex justify-between text-lg font-display pt-2 border-t border-ink/10">
              <span>TOTAL</span>
              <span>
                {convertToLocale({
                  amount: total,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      {order.shipping_address && (
        <Card className="text-left mb-8">
          <CardContent className="p-6">
            <h2 className="font-display text-xl mb-4">Shipping To</h2>
            <p className="font-bold">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            <p>{order.shipping_address.address_1}</p>
            {order.shipping_address.address_2 && (
              <p>{order.shipping_address.address_2}</p>
            )}
            <p>
              {order.shipping_address.city}, {order.shipping_address.postal_code}
            </p>
            <p className="uppercase">{order.shipping_address.country_code}</p>
          </CardContent>
        </Card>
      )}

      {/* Handling Time Notice */}
      <div className="bg-sun/20 border-2 border-ink rounded-xl p-4 text-sm text-left mb-8">
        <p className="font-bold">Estimated Handling Time: 3-5 business days</p>
        <p className="text-ink/60 mt-1">
          You&apos;ll receive a shipping confirmation email with tracking when your
          order ships.
        </p>
      </div>

      <Link href={`/${countryCode}/shop`}>
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  )
}
