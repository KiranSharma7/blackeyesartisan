import Link from 'next/link'
import { Button } from '@/components/retroui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl md:text-9xl text-ink mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
          Page Not <span className="text-acid">Found</span>
        </h2>
        <p className="text-ink/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="default" size="lg">
          <Link href="/us">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
