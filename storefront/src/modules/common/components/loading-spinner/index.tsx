import { Loader } from '@/components/retroui/Loader'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return <Loader size={size} className={className} />
}
