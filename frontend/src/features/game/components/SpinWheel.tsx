import Image from 'next/image'
import { SpinButton } from './SpinButton'
import { useSpinWheelConfig } from '@/config'

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
  // ใช้ config จาก YAML (public/config/app.yaml)
  const { duration, easing } = useSpinWheelConfig()

  // Generate transition style based on config
  const transitionStyle = isSettling
    ? `transform ${duration}ms ${easing}`
    : 'transform 75ms linear'

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Rotating wheel */}
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: transitionStyle,
        }}
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
