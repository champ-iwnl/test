import { cn } from '@/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Container({ children, className, size = 'md' }: ContainerProps) {
  const sizes = {
    sm: 'max-w-[360px]',
    md: 'max-w-[420px]',
    lg: 'max-w-[520px]',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full min-h-screen bg-white px-4 py-6 shadow-xl',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
