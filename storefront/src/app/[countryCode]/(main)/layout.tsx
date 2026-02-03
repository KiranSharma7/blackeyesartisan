import React from 'react'
import { Metadata } from 'next'
import { getBaseURL } from '@lib/util/env'
import { retrieveCart } from '@lib/data/cart'
import Header from '@modules/layout/components/header'
import Footer from '@modules/layout/components/footer'
import AnnouncementBar from '@modules/layout/components/announcement-bar'
import CartDrawerWrapper from '@modules/cart/components/cart-drawer-wrapper'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

interface MainLayoutProps {
  params: Promise<{ countryCode: string }>
  children: React.ReactNode
}

export default async function MainLayout({ params, children }: MainLayoutProps) {
  const cartPromise = retrieveCart()
  const { countryCode } = await params
  const cart = await cartPromise

  return (
    <>
      <AnnouncementBar />
      <Header countryCode={countryCode} cart={cart} />
      <main className="min-h-screen">{children}</main>
      <Footer countryCode={countryCode} />
      <CartDrawerWrapper cart={cart} countryCode={countryCode} />
    </>
  )
}
