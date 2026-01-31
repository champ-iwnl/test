import { cn } from '@/utils/cn'

interface BadgeProps {
  variant: 'locked' | 'claimable' | 'claimed'
  className?: string
  onClick?: () => void
  label?: string
}

export function Badge({ variant, className, onClick, label }: BadgeProps) {
  return (
    <button
      onClick={onClick}
      disabled={variant === 'locked'}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-full transition-all focus:outline-none',
        variant === 'locked' && 'bg-gray-200 text-gray-400 cursor-not-allowed',
        variant === 'claimable' && 'bg-gold text-white shadow-lg shadow-gold/40 animate-pulse cursor-pointer hover:scale-110',
        variant === 'claimed' && 'bg-green-500 text-white cursor-default',
        className
      )}
      aria-label={label || variant}
    >
      {variant === 'locked' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )}
      
      {variant === 'claimable' && (
        <span className="h-3 w-3 bg-white rounded-full" />
      )}
      
      {variant === 'claimed' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}

      {/* Ring effect for claimable */}
      {variant === 'claimable' && (
        <span className="absolute -inset-1 rounded-full border-2 border-gold/30 animate-ping opacity-75" />
      )}
    </button>
  )
}
