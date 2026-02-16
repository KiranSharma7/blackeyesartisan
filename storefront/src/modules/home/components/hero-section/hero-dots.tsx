'use client'

import { cn } from '@lib/util/cn'

interface HeroDotsProps {
  count: number
  activeIndex: number
  onDotClick: (index: number) => void
}

export default function HeroDots({
  count,
  activeIndex,
  onDotClick,
}: HeroDotsProps) {
  if (count <= 1) return null

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={cn(
            'h-2 rounded-full border-2 border-ink transition-all duration-300',
            index === activeIndex
              ? 'w-8 bg-acid shadow-hard-sm'
              : 'w-2 bg-paper/60 hover:bg-paper'
          )}
        />
      ))}
    </div>
  )
}
