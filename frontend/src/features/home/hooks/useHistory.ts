import { useEffect, useCallback } from 'react'
import { historyService } from '@/services/history.service'
import { rewardService } from '@/services/reward.service'
import { usePagination, useInfiniteScroll } from './usePagination'
import type { TabId } from '../constants'
import type {
  SpinLog,
  PersonalSpinLog,
  RewardHistoryItem as RewardHistoryItemType,
} from '@/types/api'

interface UseHistoryOptions {
  playerId: string | undefined
  activeTab: TabId
}

export function useHistory({ playerId, activeTab }: UseHistoryOptions) {
  // Global history pagination
  const globalHistory = usePagination<SpinLog>({
    fetchFn: (limit, offset) => historyService.getGlobalHistory(limit, offset),
    errorMessage: 'โหลดประวัติทั้งหมดไม่สำเร็จ',
  })

  // Personal history pagination
  const personalHistory = usePagination<PersonalSpinLog>({
    fetchFn: (limit, offset) =>
      historyService.getPersonalHistory(playerId!, limit, offset),
    errorMessage: 'โหลดประวัติของฉันไม่สำเร็จ',
  })

  // Reward history (no pagination needed)
  const rewardHistory = usePagination<RewardHistoryItemType>({
    fetchFn: async () => {
      const response = await rewardService.getHistory(playerId!)
      return { data: response.data || [], total: response.data?.length || 0 }
    },
    errorMessage: 'โหลดรางวัลไม่สำเร็จ',
  })

  // Load data when tab changes
  useEffect(() => {
    if (!playerId) return

    if (activeTab === 'global') {
      globalHistory.reset()
      globalHistory.loadInitial()
    } else if (activeTab === 'personal') {
      personalHistory.reset()
      personalHistory.loadInitial()
    } else if (activeTab === 'rewards') {
      rewardHistory.reset()
      rewardHistory.loadInitial()
    }
  }, [activeTab, playerId])

  // Infinite scroll handlers
  const handleLoadMore = useCallback(() => {
    if (activeTab === 'global' && globalHistory.hasMore && !globalHistory.loading) {
      globalHistory.loadMore()
    } else if (
      activeTab === 'personal' &&
      personalHistory.hasMore &&
      !personalHistory.loading
    ) {
      personalHistory.loadMore()
    }
  }, [activeTab, globalHistory, personalHistory])

  const sentinelRef = useInfiniteScroll(
    handleLoadMore,
    (activeTab === 'global' && globalHistory.hasMore) ||
      (activeTab === 'personal' && personalHistory.hasMore)
  )

  // Get current tab data
  const getCurrentTabState = () => {
    switch (activeTab) {
      case 'global':
        return {
          data: globalHistory.data,
          loading: globalHistory.loading,
          error: globalHistory.error,
          hasMore: globalHistory.hasMore,
          retry: globalHistory.retry,
        }
      case 'personal':
        return {
          data: personalHistory.data,
          loading: personalHistory.loading,
          error: personalHistory.error,
          hasMore: personalHistory.hasMore,
          retry: personalHistory.retry,
        }
      case 'rewards':
        return {
          data: rewardHistory.data,
          loading: rewardHistory.loading,
          error: rewardHistory.error,
          hasMore: false,
          retry: rewardHistory.retry,
        }
    }
  }

  return {
    globalHistory,
    personalHistory,
    rewardHistory,
    sentinelRef,
    getCurrentTabState,
  }
}
