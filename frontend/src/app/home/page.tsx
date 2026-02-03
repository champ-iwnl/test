'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { Tabs } from '@/components/ui/Tabs'
import { authService } from '@/services/auth.service'
import { historyService } from '@/services/history.service'
import { usePlayerStore } from '@/store/playerStore'
import { formatPoints, formatDate } from '@/utils/formatters'
import { Card } from '@/components/ui/Card'
import { HeroCard } from '@/features/home/components/HeroCard'
import { GlobalHistoryItem } from '@/features/history/components/GlobalHistoryItem'
import { PersonalHistoryItem } from '@/features/history/components/PersonalHistoryItem'
import { RewardHistoryItem } from '@/features/history/components/RewardHistoryItem'
import { InfiniteScrollSentinel } from '@/features/history/components/InfiniteScrollSentinel'
import { useRewardClaim, useRewardHistory } from '@/features/reward/hooks'
import type {
  GlobalHistoryResponse,
  PersonalHistoryResponse,
  SpinLog,
  PersonalSpinLog,
} from '@/types/api'

const CHECKPOINTS = [500, 1000, 5000, 10000]

export default function HomePage() {
  const router = useRouter()
  const player = usePlayerStore((state) => state.player)
  const setPlayer = usePlayerStore((state) => state.setPlayer)

  const [mounted, setMounted] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [claimedCheckpoints, setClaimedCheckpoints] = useState<number[]>([])

  const [activeTab, setActiveTab] = useState<'global' | 'personal' | 'rewards'>('global')
  const [globalHistory, setGlobalHistory] = useState<SpinLog[]>([])
  const [personalHistory, setPersonalHistory] = useState<PersonalSpinLog[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Cursor-based pagination state
  const [globalLimit] = useState(20)
  const [globalCursor, setGlobalCursor] = useState<string | null>(null)
  const [globalHasMore, setGlobalHasMore] = useState(true)
  const [loadingMoreGlobal, setLoadingMoreGlobal] = useState(false)
  const [globalLoadError, setGlobalLoadError] = useState<string | null>(null)
  const [globalRetryCount, setGlobalRetryCount] = useState(0)

  const [personalLimit] = useState(20)
  const [personalCursor, setPersonalCursor] = useState<string | null>(null)
  const [personalHasMore, setPersonalHasMore] = useState(true)
  const [loadingMorePersonal, setLoadingMorePersonal] = useState(false)
  const [personalLoadError, setPersonalLoadError] = useState<string | null>(null)
  const [personalRetryCount, setPersonalRetryCount] = useState(0)

  const { rewardHistory, loadingRewardHistory } = useRewardHistory(player?.id, activeTab === 'rewards')
  const { handleClaimCheckpoint } = useRewardClaim({
    player,
    setPlayer,
    setClaimedCheckpoints,
  })

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        // If profile fails, keep local player data but stop loading
      })
      .finally(() => setLoadingProfile(false))
  }, [mounted, player?.id, router, setPlayer])

  useEffect(() => {
    if (!player) return
    if (activeTab === 'rewards') return

    setLoadingHistory(true)
    const fetcher = async () => {
      if (activeTab === 'global') {
        // reset cursor when switching tabs
        setGlobalCursor(null)
        const response = await historyService.getGlobalHistory(globalLimit)
        setGlobalHistory(response.data || [])
        setGlobalCursor(response.next_cursor || null)
        setGlobalHasMore(response.has_more)
      }
      if (activeTab === 'personal') {
        setPersonalCursor(null)
        const response = await historyService.getPersonalHistory(player.id, personalLimit)
        setPersonalHistory(response.data || [])
        setPersonalCursor(response.next_cursor || null)
        setPersonalHasMore(response.has_more)
      }
    }

    fetcher()
      .catch(() => {
        // Ignore errors for now, UI will show empty state
      })
      .finally(() => setLoadingHistory(false))
  }, [activeTab, player])

  // Load more handlers (cursor-based)
  const loadMoreGlobal = async () => {
    if (loadingMoreGlobal) return
    if (!globalHasMore) return
    setLoadingMoreGlobal(true)
    setGlobalLoadError(null)
    try {
      const response = await historyService.getGlobalHistory(globalLimit, globalCursor || undefined)
      setGlobalHistory((prev) => [...prev, ...(response.data || [])])
      setGlobalCursor(response.next_cursor || null)
      setGlobalHasMore(response.has_more)
      setGlobalRetryCount(0)
    } catch (e) {
      setGlobalLoadError('โหลดประวัติทั้งหมดไม่สำเร็จ')
    } finally {
      setLoadingMoreGlobal(false)
    }
  }

  const loadMorePersonal = async () => {
    if (loadingMorePersonal) return
    if (!player) return
    if (!personalHasMore) return
    setLoadingMorePersonal(true)
    setPersonalLoadError(null)
    try {
      const response = await historyService.getPersonalHistory(player.id, personalLimit, personalCursor || undefined)
      setPersonalHistory((prev) => [...prev, ...(response.data || [])])
      setPersonalCursor(response.next_cursor || null)
      setPersonalHasMore(response.has_more)
      setPersonalRetryCount(0)
    } catch (e) {
      setPersonalLoadError('โหลดประวัติของฉันไม่สำเร็จ')
    } finally {
      setLoadingMorePersonal(false)
    }
  }

  // Retry with exponential backoff
  const retryLoadMoreGlobal = () => {
    const nextCount = globalRetryCount + 1
    setGlobalRetryCount(nextCount)
    const delay = Math.min(500 * Math.pow(2, nextCount), 4000)
    setTimeout(() => loadMoreGlobal(), delay)
  }

  const retryLoadMorePersonal = () => {
    const nextCount = personalRetryCount + 1
    setPersonalRetryCount(nextCount)
    const delay = Math.min(500 * Math.pow(2, nextCount), 4000)
    setTimeout(() => loadMorePersonal(), delay)
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return

        if (activeTab === 'global') {
          if (globalHasMore && !loadingMoreGlobal) {
            loadMoreGlobal()
          }
        }

        if (activeTab === 'personal') {
          if (personalHasMore && !loadingMorePersonal) {
            loadMorePersonal()
          }
        }
      },
      { root: null, rootMargin: '300px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [
    activeTab,
    globalHasMore,
    personalHasMore,
    loadingMoreGlobal,
    loadingMorePersonal,
    globalCursor,
    personalCursor,
  ])

  const totalPoints = player?.total_points ?? 0
  const totalCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1]

  const progressPercent = useMemo(() => {
    if (totalCheckpoint === 0) return 0
    return Math.min((totalPoints / totalCheckpoint) * 100, 100)
  }, [totalPoints, totalCheckpoint])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="flex flex-col">
        {/* Header section with gray background */}
        <div
          style={{
            width: '100%',
            height: '227px',
            backgroundColor: '#dddddd',
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1,
          }}
        >
          {/* Hero card inside header (centered for equal left/right spacing) */}
          <HeroCard
            totalPoints={totalPoints}
            claimedCheckpoints={claimedCheckpoints}
            loading={loadingProfile}
            displayName={player?.nickname}
            onClaim={handleClaimCheckpoint}
          />
        </div>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto pb-20 scrollbar-hide no-scrollbar"
          style={{ height: 'calc(812px - 227px - 80px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Tabs */}
          <div className="px-4 pt-4">
            <Tabs
              items={[
                { id: 'global', label: 'ประวัติทั่วโลก' },
                { id: 'personal', label: 'ประวัติของฉัน' },
                { id: 'rewards', label: 'ประวัติรางวัลของฉัน' },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as typeof activeTab)}
            />
          </div>

          {/* List items */}
          <div className="mt-3">
            {loadingProfile || loadingHistory || loadingRewardHistory ? (
              <div className="text-center text-sm text-gray-400 py-4">กำลังโหลด...</div>
            ) : null}

            {!loadingHistory && activeTab === 'global' && globalHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีประวัติทั้งหมด</div>
            ) : null}

            {!loadingHistory && activeTab === 'personal' && personalHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีประวัติของฉัน</div>
            ) : null}

            {!loadingRewardHistory && activeTab === 'rewards' && rewardHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีประวัติการรับรางวัล</div>
            ) : null}

            {activeTab === 'global' &&
              globalHistory.map((item) => (
                <GlobalHistoryItem key={item.id} item={item} />
              ))}

            {activeTab === 'personal' &&
              personalHistory.map((item) => (
                <PersonalHistoryItem key={item.id} item={item} nickname={player?.nickname ?? '-'} />
              ))}

            {activeTab === 'rewards' &&
              rewardHistory.map((item) => (
                <RewardHistoryItem key={item.id} item={item} />
              ))}

            {/* Infinite scroll status */}
            {(activeTab === 'global' || activeTab === 'personal') && (
              <>
                <InfiniteScrollSentinel
                  loading={activeTab === 'global' ? loadingMoreGlobal : loadingMorePersonal}
                  error={activeTab === 'global' ? globalLoadError : personalLoadError}
                  hasMore={activeTab === 'global' ? globalHasMore : personalHasMore}
                  onRetry={activeTab === 'global' ? retryLoadMoreGlobal : retryLoadMorePersonal}
                />
                <div ref={sentinelRef} className="h-4" />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <CtaFooter>
          <Link href="/game">
            <CtaButton>ไปเล่นเกม</CtaButton>
          </Link>
        </CtaFooter>
      </Container>
    </div>
  )
}
