import { Metadata } from 'next'
import { Pacifico, Archivo_Black, Space_Grotesk } from 'next/font/google'

import { getBaseURL } from '@lib/util/env'

import 'styles/globals.css'

// BlackEyesArtisan Design System Fonts
const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-head',
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
      className={`${pacifico.variable} ${archivoBlack.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans bg-white text-black">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
