import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

interface SpinActionButtonProps {
  isSpinning: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function SpinActionButton({
  isSpinning,
  onClick,
  disabled = false,
  className = '',
}: SpinActionButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={isSpinning ? 'หยุดการหมุน' : 'เริ่มหมุน'}
      className={cn(
        'w-[120px] h-[38px] rounded-[12.5px] bg-[#FF2428] text-white font-kanit font-bold text-[20px] leading-[24px] active:scale-100 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isSpinning ? 'หยุด' : 'เริ่มหมุน'}
    </Button>
  )
}
