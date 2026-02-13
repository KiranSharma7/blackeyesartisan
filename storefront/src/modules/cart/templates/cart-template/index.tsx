import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/retroui/Card'
import { Button } from '@/components/retroui/Button'
import CartItem from '../../components/cart-item'
import EmptyCart from '../../components/empty-cart'

interface CartTemplateProps {
  cart: HttpTypes.StoreCart | null
  countryCode: string
}

export default function CartTemplate({ cart, countryCode }: CartTemplateProps) {
  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const total = cart?.total || 0
  const currencyCode = cart?.currency_code || 'usd'

  if (items.length === 0) {
    return <EmptyCart countryCode={countryCode} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-4xl uppercase mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items Column */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-32">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
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
                  <span className="font-bold">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-ink/20 my-4"></div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="font-display">
                  {convertToLocale({
                    amount: total,
                    currency_code: currencyCode,
                  })}
                </span>
              </div>

              <Link href={`/${countryCode}/checkout`} className="block">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
