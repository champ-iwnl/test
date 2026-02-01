import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

interface SpinActionButtonProps {
  isSpinning: boolean
  onClick: () => void
  className?: string
}

export function SpinActionButton({
  isSpinning,
  onClick,
  className = '',
}: SpinActionButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      aria-label={isSpinning ? 'หยุดการหมุน' : 'เริ่มหมุน'}
      className={cn(
        'w-[120px] h-[38px] rounded-[12.5px] bg-[#FF2428] text-white font-kanit font-bold text-[20px] leading-[24px] active:scale-100 focus:ring-0',
        className
      )}
    >
      {isSpinning ? 'หยุด' : 'เริ่มหมุน'}
    </Button>
  )
}
