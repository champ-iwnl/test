import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
  style?: React.CSSProperties
}

export function Card({ children, className, noPadding = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden',
        !noPadding && 'p-4',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
