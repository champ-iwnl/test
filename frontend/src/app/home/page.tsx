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
import type {
  GlobalHistoryResponse,
  PersonalHistoryResponse,
  RewardHistoryResponse,
  SpinLog,
  PersonalSpinLog,
  RewardHistoryItem,
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
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([])
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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <Container className="relative overflow-hidden px-0 pt-0 pb-4 h-[calc(100vh-2rem)] min-h-[600px] flex flex-col">
        {/* Score card header - full bleed width */}
        <div
          style={{
            height: '227px',
            backgroundColor: '#dddddd',
            opacity: 1,
            position: 'relative',
            top: '1px',
          }}
        >
          <Card
            style={{
              position: 'absolute',
              width: '343px',
              height: '200px',
              top: '15px',
              left: '17px',
              borderWidth: '1px',
              borderColor: '#000000',
              borderRadius: '16px',
              opacity: 1,
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hidden pb-28 px-4 pt-4">

        <div className="mt-4">
          <Tabs
            items={[
              { id: 'global', label: 'ประวัติทั้งหมด' },
              { id: 'personal', label: 'ประวัติของฉัน' },
              { id: 'rewards', label: 'รางวัลที่ได้รับแล้ว' },
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>

        <div className="mt-3 space-y-3">
          {loadingProfile || loadingHistory ? (
            <div className="text-center text-sm text-gray-400">กำลังโหลด...</div>
          ) : null}

          {!loadingHistory && activeTab === 'global' && globalHistory.length === 0 ? (
            <div className="text-center text-sm text-gray-400">ยังไม่มีประวัติทั้งหมด</div>
          ) : null}

          {!loadingHistory && activeTab === 'personal' && personalHistory.length === 0 ? (
            <div className="text-center text-sm text-gray-400">ยังไม่มีประวัติของฉัน</div>
          ) : null}

          {!loadingHistory && activeTab === 'rewards' && rewardHistory.length === 0 ? (
            <div className="text-center text-sm text-gray-400">ยังไม่มีรางวัลที่ได้รับ</div>
          ) : null}

          {activeTab === 'global' &&
            globalHistory.map((item) => (
              <Card key={item.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{item.player_nickname}</div>
                  <div className="text-[11px] text-gray-400">
                    รางวัล: {formatPoints(item.points_gained)} | เล่นเมื่อ {formatDate(item.created_at)}
                  </div>
                </div>
              </Card>
            ))}

          {activeTab === 'personal' &&
            personalHistory.map((item) => (
              <Card key={item.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{player?.nickname ?? '-'}</div>
                  <div className="text-[11px] text-gray-400">
                    รางวัล: {formatPoints(item.points_gained)} | เล่นเมื่อ {formatDate(item.created_at)}
                  </div>
                </div>
              </Card>
            ))}

          {activeTab === 'rewards' &&
            rewardHistory.map((item) => (
              <Card key={item.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{item.reward_name}</div>
                  <div className="text-[11px] text-gray-400">
                    ได้รับเมื่อ {formatDate(item.claimed_at)}
                  </div>
                </div>
              </Card>
            ))}

          {/* Infinite scroll sentinel + status */}
          {(activeTab === 'global' || activeTab === 'personal') && (
            <div className="mt-2">
              {(activeTab === 'global' && globalLoadError) || (activeTab === 'personal' && personalLoadError) ? (
                <div className="flex items-center justify-center gap-2 text-sm text-red-500">
                  <span>
                    {activeTab === 'global' ? globalLoadError : personalLoadError}
                  </span>
                  <button
                    className="px-2 py-1 text-xs border border-red-200 rounded"
                    onClick={activeTab === 'global' ? retryLoadMoreGlobal : retryLoadMorePersonal}
                  >
                    ลองใหม่
                  </button>
                </div>
              ) : null}

              {(activeTab === 'global' && loadingMoreGlobal) || (activeTab === 'personal' && loadingMorePersonal) ? (
                <div className="text-center text-sm text-gray-400">กำลังโหลด...</div>
              ) : null}

              {(activeTab === 'global' && !loadingMoreGlobal && !globalLoadError && globalTotal !== null && !shouldLoadMoreGlobal) ||
              (activeTab === 'personal' && !loadingMorePersonal && !personalLoadError && personalTotal !== null && !shouldLoadMorePersonal) ? (
                <div className="text-center text-xs text-gray-400">ไม่มีข้อมูลเพิ่มเติม</div>
              ) : null}

              <div ref={sentinelRef} className="h-4" />
            </div>
          )}
        </div>

        </div>

        <CtaFooter>
          <Link href="/game">
            <CtaButton>ไปเล่นเกม</CtaButton>
          </Link>
        </CtaFooter>
      </Container>
    </div>
  )
}
