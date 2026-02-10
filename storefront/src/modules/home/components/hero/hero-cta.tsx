'use client'

type HeroCtaProps = {
  text: string
  target: string
}

export default function HeroCta({ text, target }: HeroCtaProps) {
  const handleClick = () => {
    const el = document.querySelector(target)
    if (!el) return
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className="text-white font-display font-bold uppercase tracking-wide underline underline-offset-4 decoration-2 decoration-white/50 hover:decoration-acid transition-colors px-4 py-4 sm:py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded"
    >
      {text}
    </button>
  )
}
