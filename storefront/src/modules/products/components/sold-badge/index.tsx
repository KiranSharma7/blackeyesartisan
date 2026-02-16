import { cn } from '@lib/util/cn'

interface SoldBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * SoldBadge component - displays a "SOLD" badge overlay for sold-out products
 * Uses the design system: ink/paper colors with hard shadows
 */
export default function SoldBadge({ className, size = 'md' }: SoldBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-display uppercase tracking-wider',
        // Design system: ink background, paper text, 2px border, hard shadow
        'bg-ink text-paper border-2 border-ink',
        'rounded-xl shadow-hard-sm',
        // Animation on hover (for parent hover states)
        'transition-transform duration-200',
        // Size variant
        sizeClasses[size],
        className
      )}
    >
      SOLD
    </span>
  )
}

/**
 * SoldBadgeOverlay - positioned version for use in product cards
 * Positioned absolutely in top-left corner
 */
export function SoldBadgeOverlay({
  className,
  size = 'md',
}: SoldBadgeProps) {
  return (
    <div className={cn('absolute top-3 left-3 z-10', className)}>
      <SoldBadge size={size} />
    </div>
  )
}
