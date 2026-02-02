'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { SpinWheel } from '@/features/game/components/SpinWheel'
import { SpinActionButton } from '@/features/game/components/SpinActionButton'
import { ResultModal } from '@/features/game/components/ResultModal'
import { useGamePage } from '@/features/game/hooks'

export default function GamePage() {
  const {
    mounted,
    modalOpen,
    errorMessage,
    scoreText,
    spinWheel,
    spin,
    handleCoinClick,
    handleCloseModal,
  } = useGamePage()

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="flex flex-col items-center justify-between bg-[#F8F1E7]">
        {/* Score display */}
        <div className="pt-8 text-center">
          <div className="text-[24px] font-bold text-gray-800 font-kanit">
            คะแนนสะสม {scoreText}
          </div>
        </div>

        {/* Wheel + Button */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <SpinWheel
            rotation={spinWheel.rotation}
            isSettling={spinWheel.isSettling}
            isSpinning={spinWheel.isSpinning}
            onCoinClick={handleCoinClick}
          />

          {/* Button section */}
          <div className="mt-[10px] pb-24 relative">
            <SpinActionButton
              isSpinning={spinWheel.isSpinning}
              onClick={spinWheel.isSpinning ? spinWheel.stopSpin : spin}
            />
          </div>
        </div>

        {/* Error/Status messages */}
        {errorMessage && (
          <div className="mt-3 text-sm text-red-500 text-center">{errorMessage}</div>
        )}
        {spinWheel.statusMessage && !errorMessage && (
          <div className="mt-3 text-sm text-gray-500 text-center">
            {spinWheel.statusMessage}
          </div>
        )}

        {/* Footer */}
        <CtaFooter>
          <Link href="/home">
            <CtaButton>กลับหน้าหลัก</CtaButton>
          </Link>
        </CtaFooter>
      </Container>

      {/* Result modal */}
      <ResultModal
        isOpen={modalOpen}
        points={spinWheel.result}
        onClose={handleCloseModal}
      />
    </div>
  )
}
