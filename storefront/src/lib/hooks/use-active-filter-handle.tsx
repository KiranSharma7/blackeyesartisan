'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export const useActiveFilterHandles = ({ key }: { key: string }) => {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const activeFilterHandles = searchParams.get(key)?.split(',') ?? []

    return activeFilterHandles
  }, [key, searchParams])
}
