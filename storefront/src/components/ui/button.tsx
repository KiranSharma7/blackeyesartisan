import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@lib/util/cn'

const buttonVariants = cva(
  'font-display transition-all rounded-xl outline-none cursor-pointer duration-200 font-medium flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide',
  {
    variants: {
      variant: {
        default:
          'shadow-hard-sm hover:shadow-none active:shadow-none bg-acid text-white border-2 border-ink transition hover:translate-y-[2px] hover:translate-x-[2px] active:translate-y-[3px] active:translate-x-[2px]',
        secondary:
          'shadow-hard-sm hover:shadow-none active:shadow-none bg-ink text-paper border-2 border-ink transition hover:translate-y-[2px] hover:translate-x-[2px] active:translate-y-[3px] active:translate-x-[2px] hover:bg-acid',
        outline:
          'shadow-hard-sm hover:shadow-none active:shadow-none bg-transparent border-2 border-ink transition hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-ink hover:text-paper',
        ghost: 'bg-transparent hover:bg-stone/50',
        link: 'bg-transparent hover:underline decoration-2 decoration-acid underline-offset-4',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
