import Image from 'next/image'
import { SpinButton } from './SpinButton'

interface SpinWheelProps {
  rotation: number
  isSettling: boolean
  isSpinning: boolean
  onCoinClick: () => void
  disabled?: boolean
  className?: string
}

export function SpinWheel({
  rotation,
  isSettling,
  isSpinning,
  onCoinClick,
  disabled = false,
  className = '',
}: SpinWheelProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Rotating wheel */}
      <div
        className={
          isSettling
            ? 'transition-transform duration-[2200ms] ease-[cubic-bezier(0.15,0.85,0.2,1)]'
            : 'transition-transform duration-75 linear'
        }
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <Image src="/images/spin-wheel.svg" alt="Spin wheel" width={320} height={320} priority />
      </div>

      {/* Pointer/Pin at top */}
      <div className="absolute" style={{ top: '-44px', left: '50%', transform: 'translateX(-50%)' }}>
        <Image src="/images/spin-pin.svg" alt="Pin" width={63} height={63} />
      </div>

      {/* Center button */}
      <SpinButton onClick={onCoinClick} isSpinning={isSpinning} disabled={disabled} />
    </div>
  )
}
