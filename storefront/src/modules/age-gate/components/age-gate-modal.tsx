'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useAgeGateStore } from '@lib/store/useAgeGateStore'
import { verifyAge } from '../actions'

export default function AgeGateModal() {
  const { isModalOpen, title, message, ttlDays, setVerified, setModalOpen } =
    useAgeGateStore()

  const handleVerify = async () => {
    try {
      await verifyAge(ttlDays)
      setVerified(true)
      setModalOpen(false)
    } catch (error) {
      console.error('Age verification failed:', error)
    }
  }

  const handleDecline = () => {
    // Redirect to a safe page or show a message
    window.location.href = 'https://www.google.com'
  }

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {}}
      className="relative z-50"
      static
    >
      <DialogBackdrop className="fixed inset-0 bg-ink/80 backdrop-blur-sm" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md transform overflow-hidden border-4 border-ink bg-paper p-8 shadow-hard-xl">
            {/* Logo/Brand */}
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl uppercase tracking-tight text-ink">
                Black Eyes Artisan
              </h1>
            </div>

            {/* Age Gate Content */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-4 border-ink bg-acid text-3xl font-bold text-white shadow-hard">
                18+
              </div>

              <h2 className="mb-4 font-display text-xl uppercase text-ink">
                {title}
              </h2>

              <p className="mb-8 text-sm leading-relaxed text-ink/70">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleVerify}
                  className="w-full border-4 border-ink bg-ink px-6 py-3 font-display text-sm uppercase tracking-wide text-white shadow-hard transition-all hover:-translate-y-0.5 hover:shadow-hard-xl active:translate-y-0 active:shadow-hard-sm"
                >
                  I am 18 or older
                </button>

                <button
                  onClick={handleDecline}
                  className="w-full border-4 border-ink bg-white px-6 py-3 font-display text-sm uppercase tracking-wide text-ink shadow-hard transition-all hover:-translate-y-0.5 hover:bg-stone hover:shadow-hard-xl active:translate-y-0 active:shadow-hard-sm"
                >
                  I am under 18
                </button>
              </div>

              {/* Legal Disclaimer */}
              <p className="mt-6 text-xs text-ink/50">
                By entering this site, you agree to our Terms of Service and
                Privacy Policy. This site contains products intended for adults
                only.
              </p>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
