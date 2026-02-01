'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { gameService } from '@/services/game.service'
import { usePlayerStore } from '@/store/playerStore'
import { formatPoints } from '@/utils/formatters'
import { SpinWheel } from '@/features/game/components/SpinWheel'
import { ResultModal } from '@/features/game/components/ResultModal'
import { useSpinWheel } from '@/features/game/hooks/useSpinWheel'

export default function GamePage() {
  const router = useRouter()
  const player = usePlayerStore((state) => state.player)
  const setPlayer = usePlayerStore((state) => state.setPlayer)

  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const spinWheel = useSpinWheel({
    onSpinComplete: () => {
      setModalOpen(true)
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!player) {
      router.replace('/')
    }
  }, [mounted, player, router])

  const totalPoints = player?.total_points ?? 0

  const scoreText = useMemo(() => {
    return `${formatPoints(totalPoints)}/10,000`
  }, [totalPoints])

  const spin = async () => {
    if (spinWheel.isSpinning || !player) return

    setErrorMessage(null)
    setModalOpen(false)
    spinWheel.startSpin()

    try {
      const response = await gameService.spin({ player_id: player.id })
      spinWheel.setSpinResult(response.points_gained)
      setPlayer({
        id: player.id,
        nickname: player.nickname,
        total_points: response.total_points_after,
        created_at: player.created_at,
      })
    } catch (error: any) {
      spinWheel.reset()
      setErrorMessage(error?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const handleCoinClick = () => {
    if (spinWheel.isSpinning) {
      spinWheel.stopSpin()
    } else {
      spin()
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    spinWheel.reset()
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="flex flex-col items-center justify-between bg-[#F8F1E7]">
        {/* Score display */}
        <div className="pt-8 text-center">
          <div className="text-lg font-semibold text-gray-800">คะแนนสะสม {scoreText}</div>
        </div>

        {/* Wheel container */}
        <div className="flex-1 flex items-center justify-center relative">
          <SpinWheel
            rotation={spinWheel.rotation}
            isSettling={spinWheel.isSettling}
            isSpinning={spinWheel.isSpinning}
            onCoinClick={handleCoinClick}
          />
        </div>

        {/* Button section */}
        <div className="pb-24">
          {spinWheel.isSpinning ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={spinWheel.stopSpin}
              isLoading={spinWheel.isStopping}
              className="px-6"
              style={{ borderRadius: 0 }}
            >
              หยุด
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={spin} className="px-6" style={{ borderRadius: 0 }}>
              เริ่มหมุน
            </Button>
          )}

          {errorMessage && <div className="mt-3 text-sm text-red-500 text-center">{errorMessage}</div>}
          {spinWheel.statusMessage && !errorMessage && (
            <div className="mt-3 text-sm text-gray-500 text-center">{spinWheel.statusMessage}</div>
          )}
        </div>

        {/* Footer */}
        <CtaFooter>
          <Link href="/home">
            <CtaButton>กลับหน้าหลัก</CtaButton>
          </Link>
        </CtaFooter>
      </Container>

      {/* Result modal */}
      <ResultModal isOpen={modalOpen} points={spinWheel.result} onClose={handleCloseModal} />
    </div>
  )
}
