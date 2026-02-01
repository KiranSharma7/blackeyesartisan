import { cache } from 'react'

import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import { HttpTypes } from '@medusajs/types'

export const listRegions = cache(async function () {
  return sdk.store.region
    .list({}, { next: { tags: ['regions'] } })
    .then(({ regions }) => regions)
    .catch(medusaError)
})

export const retrieveRegion = cache(async function (id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ['regions'] } })
    .then(({ region }) => region)
    .catch(medusaError)
})

// Cached single region - USD only
let cachedRegion: HttpTypes.StoreRegion | null = null

/**
 * Returns the single US region.
 * The countryCode parameter is kept for interface compatibility but is ignored.
 * All requests use the same USD region.
 */
export const getRegion = cache(async function (_countryCode?: string) {
  try {
    // Return cached region if available
    if (cachedRegion) {
      return cachedRegion
    }

    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      return null
    }

    // Always use the first (and only) region - United States / USD
    cachedRegion = regions[0]
    return cachedRegion
  } catch (e: any) {
    return null
  }
})
