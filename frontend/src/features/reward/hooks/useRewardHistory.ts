import { useCallback, useEffect, useState } from 'react'
import { rewardService } from '@/services/reward.service'
import type { RewardHistoryItem, RewardHistoryResponse } from '@/types/api'

export function useRewardHistory(playerId?: string, isActive?: boolean) {
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([])
  const [loadingRewardHistory, setLoadingRewardHistory] = useState(false)

  const fetchRewardHistory = useCallback(async () => {
    if (!playerId) {
      setRewardHistory([])
      return
    }

    setLoadingRewardHistory(true)
    try {
      const response: RewardHistoryResponse = await rewardService.getHistory(playerId)
      setRewardHistory(response.data || [])
    } catch {
      setRewardHistory([])
    } finally {
      setLoadingRewardHistory(false)
    }
  }, [playerId])

  useEffect(() => {
    if (!isActive) return
    fetchRewardHistory()
  }, [fetchRewardHistory, isActive])

  return { rewardHistory, loadingRewardHistory, refreshRewardHistory: fetchRewardHistory }
}
