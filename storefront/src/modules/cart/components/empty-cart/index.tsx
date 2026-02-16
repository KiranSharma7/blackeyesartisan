import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/retroui/Button'

interface EmptyCartProps {
  countryCode: string
}

export default function EmptyCart({ countryCode }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-20 h-20 bg-ink/5 rounded-full border-2 border-ink
                    flex items-center justify-center mb-6"
      >
        <ShoppingBag className="w-10 h-10 text-ink/40" />
      </div>
      <h2 className="font-display font-bold text-2xl uppercase mb-2">Your Cart is Empty</h2>
      <p className="text-ink/60 font-medium mb-8 max-w-md">
        Looks like you haven&apos;t added any items to your cart yet. Browse our
        collection of handcrafted glass art.
      </p>
      <Link href={`/${countryCode}/shop`}>
        <Button size="xl">Shop Now</Button>
      </Link>
    </div>
  )
}
