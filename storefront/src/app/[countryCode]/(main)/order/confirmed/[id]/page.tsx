import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveOrder } from '@lib/data/orders'
import { getGlobalSettings } from '@lib/data/fetch'
import OrderConfirmation from '@modules/checkout/templates/order-confirmation'

export const metadata: Metadata = {
  title: 'Order Confirmed | BlackEyesArtisan',
  description: 'Your order has been confirmed',
}

interface OrderConfirmedPageProps {
  params: Promise<{ countryCode: string; id: string }>
}

export default async function OrderConfirmedPage({
  params,
}: OrderConfirmedPageProps) {
  const { countryCode, id } = await params

  // Fetch order and global settings in parallel
  const [order, globalSettingsResponse] = await Promise.all([
    retrieveOrder(id),
    getGlobalSettings(),
  ])

  if (!order) {
    notFound()
  }

  // Extract settings with fallbacks
  const globalSettings = globalSettingsResponse?.data
  const handlingTimeDays = globalSettings?.handlingTimeDays ?? 5
  const dutiesDisclaimer =
    globalSettings?.dutiesDisclaimer ||
    'International orders may be subject to customs duties and taxes upon delivery. These fees are the responsibility of the recipient.'

  return (
    <OrderConfirmation
      order={order}
      countryCode={countryCode}
      handlingTimeDays={handlingTimeDays}
      dutiesDisclaimer={dutiesDisclaimer}
    />
  )
}
