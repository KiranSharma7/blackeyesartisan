import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retrieveOrder } from '@lib/data/orders'
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

  const order = await retrieveOrder(id)

  if (!order) {
    notFound()
  }

  return <OrderConfirmation order={order} countryCode={countryCode} />
}
