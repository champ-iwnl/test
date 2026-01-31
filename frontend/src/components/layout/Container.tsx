import { cn } from '@/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[450px] min-h-screen bg-white px-4 py-6 shadow-xl',
        className
      )}
    >
      {children}
    </div>
  )
}
