import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@lib/util/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase border-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'border-ink bg-paper text-ink',
        primary: 'border-ink bg-acid text-white',
        secondary: 'border-ink bg-ink text-paper',
        success: 'border-ink bg-green-500 text-white',
        warning: 'border-ink bg-sun text-ink',
        outline: 'border-ink bg-transparent text-ink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
