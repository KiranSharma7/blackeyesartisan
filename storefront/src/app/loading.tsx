import LoadingSpinner from '@modules/common/components/loading-spinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="font-display text-ink/60 uppercase tracking-wider">Loading</p>
      </div>
    </div>
  )
}
