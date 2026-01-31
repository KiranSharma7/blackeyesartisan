import React from 'react'
import { Metadata } from 'next'

import { getBaseURL } from '@lib/util/env'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: {
  params: Promise<{ countryCode: string }>
  children: React.ReactNode
}) {
  return <>{props.children}</>
}
