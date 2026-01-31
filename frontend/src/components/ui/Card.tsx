import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className, noPadding = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden',
        !noPadding && 'p-4',
        className
      )}
    >
      {children}
    </div>
  )
}
