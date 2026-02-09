import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-24 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl md:text-9xl text-ink mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
          Page Not <span className="text-acid">Found</span>
        </h2>
        <p className="text-ink/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/us"
            className="inline-block px-8 py-4 bg-ink text-paper font-display text-lg uppercase border-2 border-ink rounded-lg shadow-hard hover:shadow-hard-xl hover:-translate-y-1 transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/us/shop"
            className="inline-block px-8 py-4 bg-paper text-ink font-display text-lg uppercase border-2 border-ink rounded-lg shadow-hard hover:shadow-hard-xl hover:-translate-y-1 transition-all"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
