import Image from 'next/image'

interface SpinButtonProps {
  onClick: () => void
  isSpinning: boolean
  disabled?: boolean
  className?: string
}

export function SpinButton({ onClick, isSpinning, disabled = false, className = '' }: SpinButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isSpinning ? 'หยุดการหมุน' : 'เริ่มหมุน'}
      className={`absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Image
        src="/images/spin-coin.svg"
        alt="Coin"
        width={72}
        height={72}
        className={isSpinning ? 'animate-pulse' : ''}
      />
    </button>
  )
}
