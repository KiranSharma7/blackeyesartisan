'use client'

import { useEffect, useRef } from 'react'
import { useAgeGateStore } from '@lib/store/useAgeGateStore'
import AgeGateModal from './age-gate-modal'

interface AgeGateProviderProps {
  children: React.ReactNode
  isVerified: boolean
  enabled: boolean
  ttlDays: number
  title: string
  message: string
}

export default function AgeGateProvider({
  children,
  isVerified,
  enabled,
  ttlDays,
  title,
  message,
}: AgeGateProviderProps) {
  const { setVerified, setModalOpen, setConfig } = useAgeGateStore()
  const initialized = useRef(false)

  useEffect(() => {
    // Only initialize once - don't override client state changes
    if (!initialized.current) {
      setConfig({ ttlDays, title, message })
      setVerified(isVerified)

      // Show/hide modal based on initial verification status
      if (enabled) {
        setModalOpen(!isVerified)
      } else {
        setModalOpen(false)
      }

      initialized.current = true
    }
  }, [enabled, isVerified, ttlDays, title, message, setVerified, setModalOpen, setConfig])

  return (
    <>
      {children}
      <AgeGateModal />
    </>
  )
}
