import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayerStore } from '@/store/playerStore'
import { gameService } from '@/services/game.service'
import { formatPoints } from '@/utils/formatters'
import { useSpinWheel } from './useSpinWheel'

interface UseGamePageOptions {
  maxScore?: number
}

export function useGamePage(options: UseGamePageOptions = {}) {
  const { maxScore = 10000 } = options
  
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

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auth guard
  useEffect(() => {
    if (!mounted) return
    if (!player) {
      router.replace('/')
    }
  }, [mounted, player, router])

  // Computed values
  const totalPoints = player?.total_points ?? 0

  const scoreText = useMemo(() => {
    return `${formatPoints(totalPoints)}/${formatPoints(maxScore)}`
  }, [totalPoints, maxScore])

  // Actions
  const spin = useCallback(async () => {
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
      setErrorMessage(
        error?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      )
    }
  }, [player, spinWheel, setPlayer])

  const handleCoinClick = useCallback(() => {
    if (spinWheel.isSpinning) {
      spinWheel.stopSpin()
    } else {
      spin()
    }
  }, [spinWheel, spin])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    spinWheel.reset()
  }, [spinWheel])

  return {
    // State
    mounted,
    modalOpen,
    errorMessage,
    totalPoints,
    scoreText,
    player,
    
    // Spin wheel state
    spinWheel,
    
    // Actions
    spin,
    handleCoinClick,
    handleCloseModal,
  }
}
