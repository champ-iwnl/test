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
import { rewardService } from '@/services/reward.service'
import { usePlayerStore } from '@/store/playerStore'
import { formatPoints, formatDate } from '@/utils/formatters'
import { Card } from '@/components/ui/Card'
import { HeroCard } from '@/features/home/components/HeroCard'
import { GlobalHistoryItem } from '@/features/history/components/GlobalHistoryItem'
import { PersonalHistoryItem } from '@/features/history/components/PersonalHistoryItem'
import { RewardHistoryItem } from '@/features/history/components/RewardHistoryItem'
import { InfiniteScrollSentinel } from '@/features/history/components/InfiniteScrollSentinel'
import type {
  GlobalHistoryResponse,
  PersonalHistoryResponse,
  RewardHistoryResponse,
  SpinLog,
  PersonalSpinLog,
  RewardHistoryItem as RewardHistoryItemType,
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
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItemType[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  // Pagination / lazy-load state
  const [globalLimit] = useState(20)
  const [globalOffset, setGlobalOffset] = useState(0)
  const [globalTotal, setGlobalTotal] = useState<number | null>(null)
  const [loadingMoreGlobal, setLoadingMoreGlobal] = useState(false)
  const [globalLoadError, setGlobalLoadError] = useState<string | null>(null)
  const [globalRetryCount, setGlobalRetryCount] = useState(0)

  const [personalLimit] = useState(20)
  const [personalOffset, setPersonalOffset] = useState(0)
  const [personalTotal, setPersonalTotal] = useState<number | null>(null)
  const [loadingMorePersonal, setLoadingMorePersonal] = useState(false)
  const [personalLoadError, setPersonalLoadError] = useState<string | null>(null)
  const [personalRetryCount, setPersonalRetryCount] = useState(0)

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

    setLoadingHistory(true)
    const fetcher = async () => {
      if (activeTab === 'global') {
        // reset paging when switching tabs
        setGlobalOffset(0)
        const response: GlobalHistoryResponse = await historyService.getGlobalHistory(globalLimit, 0)
        setGlobalHistory(response.data || [])
        setGlobalTotal(response.total ?? null)
      }
      if (activeTab === 'personal') {
        setPersonalOffset(0)
        const response: PersonalHistoryResponse = await historyService.getPersonalHistory(player.id, personalLimit, 0)
        setPersonalHistory(response.data || [])
        setPersonalTotal(response.total ?? null)
      }
      if (activeTab === 'rewards') {
        const response: RewardHistoryResponse = await rewardService.getHistory(player.id)
        setRewardHistory(response.data || [])
      }
    }

    fetcher()
      .catch(() => {
        // Ignore errors for now, UI will show empty state
      })
      .finally(() => setLoadingHistory(false))
  }, [activeTab, player])

  const shouldLoadMoreGlobal =
    globalTotal !== null && globalOffset + globalHistory.length < globalTotal
  const shouldLoadMorePersonal =
    personalTotal !== null && personalOffset + personalHistory.length < personalTotal

  // Load more handlers
  const loadMoreGlobal = async () => {
    if (loadingMoreGlobal) return
    if (!shouldLoadMoreGlobal) return
    setLoadingMoreGlobal(true)
    setGlobalLoadError(null)
    try {
      const nextOffset = globalOffset + globalLimit
      const response: GlobalHistoryResponse = await historyService.getGlobalHistory(globalLimit, nextOffset)
      setGlobalHistory((prev) => [...prev, ...(response.data || [])])
      setGlobalOffset(nextOffset)
      setGlobalTotal(response.total ?? null)
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
    if (!shouldLoadMorePersonal) return
    setLoadingMorePersonal(true)
    setPersonalLoadError(null)
    try {
      const nextOffset = personalOffset + personalLimit
      const response: PersonalHistoryResponse = await historyService.getPersonalHistory(player.id, personalLimit, nextOffset)
      setPersonalHistory((prev) => [...prev, ...(response.data || [])])
      setPersonalOffset(nextOffset)
      setPersonalTotal(response.total ?? null)
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
          if (shouldLoadMoreGlobal && !loadingMoreGlobal) {
            loadMoreGlobal()
          }
        }

        if (activeTab === 'personal') {
          if (shouldLoadMorePersonal && !loadingMorePersonal) {
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
    shouldLoadMoreGlobal,
    shouldLoadMorePersonal,
    loadingMoreGlobal,
    loadingMorePersonal,
    globalOffset,
    personalOffset,
  ])

  const totalPoints = player?.total_points ?? 0
  const totalCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1]

  const progressPercent = useMemo(() => {
    if (totalCheckpoint === 0) return 0
    return Math.min((totalPoints / totalCheckpoint) * 100, 100)
  }, [totalPoints, totalCheckpoint])

  const handleClaimCheckpoint = async (checkpoint: number) => {
    if (!player) return
    try {
      await rewardService.claimCheckpoint(player.id, checkpoint)
      // Update claimed checkpoints
      setClaimedCheckpoints((prev) => Array.from(new Set([...prev, checkpoint])))
    } catch (error) {
      console.error('Failed to claim checkpoint:', error)
      // TODO: Show error toast
    }
  }

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
                { id: 'rewards', label: 'รางวัลที่ได้รับแล้ว' },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as typeof activeTab)}
            />
          </div>

          {/* List items */}
          <div className="mt-3">
            {loadingProfile || loadingHistory ? (
              <div className="text-center text-sm text-gray-400 py-4">กำลังโหลด...</div>
            ) : null}

            {!loadingHistory && activeTab === 'global' && globalHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีประวัติทั้งหมด</div>
            ) : null}

            {!loadingHistory && activeTab === 'personal' && personalHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีประวัติของฉัน</div>
            ) : null}

            {!loadingHistory && activeTab === 'rewards' && rewardHistory.length === 0 ? (
              <div className="text-center text-sm text-gray-400 py-4">ยังไม่มีรางวัลที่ได้รับ</div>
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
                  hasMore={activeTab === 'global' ? shouldLoadMoreGlobal : shouldLoadMorePersonal}
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
