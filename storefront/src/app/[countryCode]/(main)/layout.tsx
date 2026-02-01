import React from 'react'
import { Metadata } from 'next'
import { getBaseURL } from '@lib/util/env'
import { retrieveCart } from '@lib/data/cart'
import Header from '@modules/layout/components/header'
import Footer from '@modules/layout/components/footer'
import CartDrawer from '@modules/cart/components/cart-drawer'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

interface MainLayoutProps {
  params: Promise<{ countryCode: string }>
  children: React.ReactNode
}

export default async function MainLayout({ params, children }: MainLayoutProps) {
  const { countryCode } = await params
  const cart = await retrieveCart()

  return (
    <>
      <Header countryCode={countryCode} cart={cart} />
      <main className="min-h-screen">{children}</main>
      <Footer countryCode={countryCode} />
      <CartDrawer cart={cart} countryCode={countryCode} />
    </>
  )
}
