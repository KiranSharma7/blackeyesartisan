import { Metadata } from 'next'
import { Dela_Gothic_One, Space_Grotesk } from 'next/font/google'

import { getBaseURL } from '@lib/util/env'

import 'styles/globals.css'

// BlackEyesArtisan Design System Fonts
const delaGothicOne = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: 'Black Eyes Artisan | Handcrafted Glass Art',
  description:
    'Premium handcrafted glass pipes by Black Eyes Artisan. Unique, artisan-made functional glass art.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${delaGothicOne.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans bg-white text-black">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
