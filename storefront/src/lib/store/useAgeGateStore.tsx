'use client'

import { create } from 'zustand'

interface AgeGateStore {
  isVerified: boolean
  isModalOpen: boolean
  ttlDays: number
  title: string
  message: string
  setVerified: (verified: boolean) => void
  setModalOpen: (open: boolean) => void
  setConfig: (config: { ttlDays: number; title: string; message: string }) => void
}

export const useAgeGateStore = create<AgeGateStore>((set) => ({
  isVerified: false,
  isModalOpen: false,
  ttlDays: 30,
  title: 'Age Verification Required',
  message:
    'You must be 18 years or older to enter this site. By entering, you confirm that you are of legal age.',
  setVerified: (verified) => set({ isVerified: verified }),
  setModalOpen: (open) => set({ isModalOpen: open }),
  setConfig: (config) =>
    set({
      ttlDays: config.ttlDays,
      title: config.title,
      message: config.message,
    }),
}))
