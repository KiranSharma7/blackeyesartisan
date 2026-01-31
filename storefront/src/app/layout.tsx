import { Metadata } from 'next'
import { Dela_Gothic_One, Space_Grotesk } from 'next/font/google'

import { getBaseURL } from '@lib/util/env'
import { ProgressBar } from '@modules/common/components/progress-bar'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from 'sonner'

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
      <body className="font-sans bg-paper text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <ProgressBar />
          <Toaster position="bottom-right" offset={65} closeButton />
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
