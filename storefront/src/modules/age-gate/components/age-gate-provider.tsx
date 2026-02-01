'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    // Set the configuration from server
    setConfig({ ttlDays, title, message })

    // Set verification status from server-side cookie check
    setVerified(isVerified)

    // Show/hide modal based on age gate enabled status and verification
    if (enabled) {
      setModalOpen(!isVerified)
    } else {
      setModalOpen(false)
    }
  }, [enabled, isVerified, ttlDays, title, message, setVerified, setModalOpen, setConfig])

  return (
    <>
      {children}
      <AgeGateModal />
    </>
  )
}
