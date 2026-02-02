'use client'

import { HttpTypes } from '@medusajs/types'
import CheckoutSection from '../../components/checkout-section'
import ShippingAddressForm from '../../components/shipping-address'
import ShippingMethodSelect from '../../components/shipping-method'
import PaymentForm from '../../components/payment'
import CheckoutSummary from '../../components/checkout-summary'

interface CheckoutTemplateProps {
  cart: HttpTypes.StoreCart
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  paymentMethods: HttpTypes.StorePaymentProvider[]
  countryCode: string
  step: 'address' | 'delivery' | 'payment'
  dutiesDisclaimer?: string | null
}

export default function CheckoutTemplate({
  cart,
  shippingOptions,
  paymentMethods,
  countryCode,
  step,
  dutiesDisclaimer,
}: CheckoutTemplateProps) {
  const hasAddress = !!cart.shipping_address?.address_1
  const hasShippingMethod = cart.shipping_methods && cart.shipping_methods.length > 0

  return (
    <div className="min-h-screen bg-stone/20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="font-display text-4xl uppercase mb-8 text-center">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Column */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <CheckoutSection
              title="Shipping Address"
              isComplete={hasAddress && step !== 'address'}
              isActive={step === 'address'}
            >
              {step === 'address' ? (
                <ShippingAddressForm cart={cart} countryCode={countryCode} />
              ) : (
                <div className="text-sm">
                  <p className="font-bold">
                    {cart.shipping_address?.first_name}{' '}
                    {cart.shipping_address?.last_name}
                  </p>
                  <p>{cart.shipping_address?.address_1}</p>
                  <p>
                    {cart.shipping_address?.city},{' '}
                    {cart.shipping_address?.postal_code}
                  </p>
                  <p className="uppercase">
                    {cart.shipping_address?.country_code}
                  </p>
                </div>
              )}
            </CheckoutSection>

            {/* Shipping Method */}
            {hasAddress && (
              <CheckoutSection
                title="Shipping Method"
                isComplete={hasShippingMethod && step === 'payment'}
                isActive={step === 'delivery'}
              >
                {step === 'delivery' ? (
                  <ShippingMethodSelect
                    cart={cart}
                    shippingOptions={shippingOptions}
                    countryCode={countryCode}
                  />
                ) : hasShippingMethod ? (
                  <div className="text-sm">
                    <p className="font-bold">
                      {cart.shipping_methods?.[0]?.name || 'Standard Shipping'}
                    </p>
                  </div>
                ) : (
                  <p className="text-ink/60 text-sm">
                    Complete shipping address first
                  </p>
                )}
              </CheckoutSection>
            )}

            {/* Payment */}
            {hasShippingMethod && (
              <CheckoutSection
                title="Payment"
                isActive={step === 'payment'}
              >
                {step === 'payment' ? (
                  <PaymentForm cart={cart} paymentMethods={paymentMethods} />
                ) : (
                  <p className="text-ink/60 text-sm">
                    Complete shipping method first
                  </p>
                )}
              </CheckoutSection>
            )}
          </div>

          {/* Summary Column */}
          <div>
            <CheckoutSummary cart={cart} dutiesDisclaimer={dutiesDisclaimer} />
          </div>
        </div>
      </div>
    </div>
  )
}
