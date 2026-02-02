import { cn } from '@/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'relative mx-auto bg-white overflow-hidden',
        className
      )}
      style={{
        width: '100%',
        maxWidth: '500px',
        height: '812px',
        opacity: 1,
      }}
    >
      {children}
    </div>
  )
}
