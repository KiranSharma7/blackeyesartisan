import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface CheckoutSectionProps {
  title: string
  children: ReactNode
  isComplete?: boolean
  isActive?: boolean
}

export default function CheckoutSection({
  title,
  children,
  isComplete = false,
  isActive = true,
}: CheckoutSectionProps) {
  return (
    <Card className={!isActive ? 'opacity-50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {isComplete && (
          <span className="text-green-600 text-sm font-bold uppercase">
            Complete
          </span>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
