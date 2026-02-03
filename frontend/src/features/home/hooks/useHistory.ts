import { useEffect, useCallback, useRef } from 'react'
import { historyService } from '@/services/history.service'
import { rewardService } from '@/services/reward.service'
import { useCursorPagination, usePagination, useInfiniteScroll } from './usePagination'
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
  // Global history pagination (cursor-based)
  const globalHistory = useCursorPagination<SpinLog>({
    fetchFn: (limit, cursor) => historyService.getGlobalHistory(limit, cursor),
    errorMessage: 'โหลดประวัติทั้งหมดไม่สำเร็จ',
  })

  // Personal history pagination (cursor-based)
  const personalHistory = useCursorPagination<PersonalSpinLog>({
    fetchFn: (limit, cursor) =>
      historyService.getPersonalHistory(playerId!, limit, cursor),
    errorMessage: 'โหลดประวัติของฉันไม่สำเร็จ',
  })

  // Reward history (no pagination needed - small dataset)
  const rewardHistory = usePagination<RewardHistoryItemType>({
    fetchFn: async () => {
      const response = await rewardService.getHistory(playerId!)
      return { data: response.data || [], total: response.data?.length || 0 }
    },
    errorMessage: 'โหลดรางวัลไม่สำเร็จ',
  })

  // Prevent duplicate calls in StrictMode
  const loadingRef = useRef(false)

  // Load data when tab changes
  useEffect(() => {
    if (!playerId) return
    if (loadingRef.current) return
    loadingRef.current = true

    const load = async () => {
      if (activeTab === 'global') {
        globalHistory.reset()
        await globalHistory.loadInitial()
      } else if (activeTab === 'personal') {
        personalHistory.reset()
        await personalHistory.loadInitial()
      } else if (activeTab === 'rewards') {
        rewardHistory.reset()
        await rewardHistory.loadInitial()
      }
      loadingRef.current = false
    }

    load()

    return () => {
      loadingRef.current = false
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
