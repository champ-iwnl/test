import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayerStore } from '@/store/playerStore'
import { authService } from '@/services/auth.service'
import { rewardService } from '@/services/reward.service'
import { CHECKPOINTS, type TabId } from '../constants'

export function useHomePage() {
  const router = useRouter()
  const player = usePlayerStore((state) => state.player)
  const setPlayer = usePlayerStore((state) => state.setPlayer)

  const [mounted, setMounted] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [claimedCheckpoints, setClaimedCheckpoints] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<TabId>('global')

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auth guard & profile fetch
  useEffect(() => {
    if (!mounted) return
    if (!player) {
      router.replace('/')
      return
    }

    setLoadingProfile(true)
    authService
      .getProfile(player.id)
      .then((data) => {
        setPlayer({
          id: data.id,
          nickname: data.nickname,
          total_points: data.total_points,
          created_at: data.created_at,
        })
        setClaimedCheckpoints(data.claimed_checkpoints || [])
      })
      .catch(() => {
        // Keep local player data on error
      })
      .finally(() => setLoadingProfile(false))
  }, [mounted, player?.id, router, setPlayer])

  // Computed values
  const totalPoints = player?.total_points ?? 0
  const maxCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1]

  const progressPercent = useMemo(() => {
    return Math.min((totalPoints / maxCheckpoint) * 100, 100)
  }, [totalPoints, maxCheckpoint])

  // Actions
  const handleClaimCheckpoint = useCallback(
    async (checkpoint: number) => {
      if (!player) return
      try {
        await rewardService.claimCheckpoint(player.id, checkpoint)
        setClaimedCheckpoints((prev) => Array.from(new Set([...prev, checkpoint])))
      } catch (error) {
        console.error('Failed to claim checkpoint:', error)
        throw error
      }
    },
    [player]
  )

  return {
    // State
    mounted,
    loadingProfile,
    player,
    totalPoints,
    progressPercent,
    claimedCheckpoints,
    activeTab,
    
    // Actions
    setActiveTab,
    handleClaimCheckpoint,
  }
}
