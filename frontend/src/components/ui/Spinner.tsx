import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'gold' | 'white' | 'gray'
}

export function Spinner({ size = 'md', className, variant = 'gold' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  const colorClasses = {
    gold: 'border-gold border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
  }

  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[variant],
        className
      )}
    />
  )
}
