import { useCallback } from 'react'
import { authService } from '@/services/auth.service'
import { rewardService } from '@/services/reward.service'
import type { Player } from '@/types/api'

interface UseRewardClaimParams {
  player: Player | null
  setPlayer: (player: Player) => void
  setClaimedCheckpoints: (value: number[] | ((prev: number[]) => number[])) => void
}

export function useRewardClaim({ player, setPlayer, setClaimedCheckpoints }: UseRewardClaimParams) {
  const handleClaimCheckpoint = useCallback(
    async (checkpoint: number) => {
      if (!player) return { reward_name: '' }
      try {
        const response = await rewardService.claimCheckpoint(player.id, checkpoint)

        // Refresh profile to get updated claimed checkpoints from backend
        const updatedProfile = await authService.getProfile(player.id)
        setClaimedCheckpoints(updatedProfile.claimed_checkpoints || [])

        // Also update player store with new points if changed
        setPlayer({
          id: updatedProfile.id,
          nickname: updatedProfile.nickname,
          total_points: updatedProfile.total_points,
          created_at: updatedProfile.created_at,
        })

        return { reward_name: response.reward_name }
      } catch (error: any) {
        // Extract error code from nested error object
        const errorCode = error?.response?.data?.error?.code
        const errorMessage = error?.response?.data?.error?.message || 'ไม่สามารถรับรางวัลได้'

        // Handle already claimed error - refresh to get latest data
        if (errorCode === 'ALREADY_CLAIMED') {
          try {
            const updatedProfile = await authService.getProfile(player.id)
            setClaimedCheckpoints(updatedProfile.claimed_checkpoints || [])
          } catch {
            // If refresh fails, fallback to local state
            setClaimedCheckpoints((prev) => {
              const newSet = new Set([...prev, checkpoint])
              return Array.from(newSet)
            })
          }
          console.warn('Reward already claimed:', checkpoint)
        } else {
          console.error('Failed to claim checkpoint:', errorMessage)
        }
        return { reward_name: '' }
      }
    },
    [player, setPlayer, setClaimedCheckpoints]
  )

  return { handleClaimCheckpoint }
}
