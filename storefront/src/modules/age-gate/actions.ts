'use server'

import { getAgeVerified, setAgeVerified } from '@lib/data/cookies'

export async function verifyAge(ttlDays: number): Promise<void> {
  await setAgeVerified(ttlDays)
}

export async function checkAgeVerification(): Promise<boolean> {
  return await getAgeVerified()
}
