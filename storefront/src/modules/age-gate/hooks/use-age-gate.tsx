'use client'

import { useCallback } from 'react'
import { useAgeGateStore } from '@lib/store/useAgeGateStore'
import { checkAgeVerification } from '../actions'

export function useAgeGate() {
  const { isVerified, setVerified, setModalOpen } = useAgeGateStore()

  const requireVerification = useCallback(async (): Promise<boolean> => {
    // First check the store state
    if (isVerified) {
      return true
    }

    // Then check the server-side cookie
    const serverVerified = await checkAgeVerification()

    if (serverVerified) {
      setVerified(true)
      return true
    }

    // Not verified, show the modal
    setModalOpen(true)
    return false
  }, [isVerified, setVerified, setModalOpen])

  const showAgeGate = useCallback(() => {
    setModalOpen(true)
  }, [setModalOpen])

  return {
    isVerified,
    requireVerification,
    showAgeGate,
  }
}
