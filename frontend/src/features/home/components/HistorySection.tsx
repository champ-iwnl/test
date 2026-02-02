'use client'

import React from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { GlobalHistoryItem } from '@/features/history/components/GlobalHistoryItem'
import { PersonalHistoryItem } from '@/features/history/components/PersonalHistoryItem'
import { RewardHistoryItem } from '@/features/history/components/RewardHistoryItem'
import { InfiniteScrollSentinel } from '@/features/history/components/InfiniteScrollSentinel'
import type { TabId } from '../constants'
import type {
  SpinLog,
  PersonalSpinLog,
  RewardHistoryItem as RewardHistoryItemType,
} from '@/types/api'

interface HistorySectionProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  globalHistory: SpinLog[]
  personalHistory: PersonalSpinLog[]
  rewardHistory: RewardHistoryItemType[]
  playerNickname: string
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  onRetry: () => void
  sentinelRef: React.RefObject<HTMLDivElement>
}

const TAB_ITEMS = [
  { id: 'global', label: 'ประวัติทั่วโลก' },
  { id: 'personal', label: 'ประวัติของฉัน' },
  { id: 'rewards', label: 'รางวัลที่ได้รับแล้ว' },
] as const

export function HistorySection({
  activeTab,
  onTabChange,
  globalHistory,
  personalHistory,
  rewardHistory,
  playerNickname,
  loading,
  loadingMore,
  error,
  hasMore,
  onRetry,
  sentinelRef,
}: HistorySectionProps) {
  return (
    <>
      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs
          items={TAB_ITEMS as unknown as { id: string; label: string }[]}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as TabId)}
        />
      </div>

      {/* List items */}
      <div className="mt-3">
        {/* Loading state */}
        {loading && (
          <div className="text-center text-sm text-gray-400 py-4">กำลังโหลด...</div>
        )}

        {/* Empty states */}
        {!loading && activeTab === 'global' && globalHistory.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">
            ยังไม่มีประวัติทั้งหมด
          </div>
        )}

        {!loading && activeTab === 'personal' && personalHistory.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">
            ยังไม่มีประวัติของฉัน
          </div>
        )}

        {!loading && activeTab === 'rewards' && rewardHistory.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">
            ยังไม่มีรางวัลที่ได้รับ
          </div>
        )}

        {/* Global history list */}
        {activeTab === 'global' &&
          globalHistory.map((item) => (
            <GlobalHistoryItem key={item.id} item={item} />
          ))}

        {/* Personal history list */}
        {activeTab === 'personal' &&
          personalHistory.map((item) => (
            <PersonalHistoryItem
              key={item.id}
              item={item}
              nickname={playerNickname}
            />
          ))}

        {/* Reward history list */}
        {activeTab === 'rewards' &&
          rewardHistory.map((item) => <RewardHistoryItem key={item.id} item={item} />)}

        {/* Infinite scroll sentinel */}
        {(activeTab === 'global' || activeTab === 'personal') && (
          <>
            <InfiniteScrollSentinel
              loading={loadingMore}
              error={error}
              hasMore={hasMore}
              onRetry={onRetry}
            />
            <div ref={sentinelRef} className="h-4" />
          </>
        )}
      </div>
    </>
  )
}
