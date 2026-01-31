'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
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
        const response: GlobalHistoryResponse = await historyService.getGlobalHistory(100, 0)
        setGlobalHistory(response.data || [])
      }
      if (activeTab === 'personal') {
        const response: PersonalHistoryResponse = await historyService.getPersonalHistory(player.id, 100, 0)
        setPersonalHistory(response.data || [])
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

  const totalPoints = player?.total_points ?? 0
  const totalCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1]

  const progressPercent = useMemo(() => {
    if (totalCheckpoint === 0) return 0
    return Math.min((totalPoints / totalCheckpoint) * 100, 100)
  }, [totalPoints, totalCheckpoint])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <Container className="relative rounded-3xl px-4 pt-4 pb-24">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>Home</span>
          <span className="font-medium text-gray-600">{player?.nickname ?? '-'}</span>
        </div>

        <Card className="border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-red text-white text-[10px] px-2 py-1">
                แสดงคะแนน
              </div>
              <div className="mt-2 text-gray-700 font-semibold">คะแนนสะสม</div>
            </div>
            <div className="text-right text-gray-700 text-sm">คะแนนรวม 10,000 รอบของขวัญ 1 รายการ</div>
          </div>

          <div className="mt-2 text-2xl font-bold text-red">
            {formatPoints(totalPoints)}/{formatPoints(totalCheckpoint)}
          </div>

          <div className="mt-4">
            <div className="relative h-2 rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-gold"
                style={{ width: `${progressPercent}%` }}
              />
              {CHECKPOINTS.map((value) => {
                const left = (value / totalCheckpoint) * 100
                const isClaimed = claimedCheckpoints.includes(value)
                const isReach = totalPoints >= value
                return (
                  <div
                    key={value}
                    className="absolute -top-2"
                    style={{ left: `calc(${left}% - 10px)` }}
                  >
                    <div
                      className={
                        isClaimed
                          ? 'h-5 w-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center'
                          : isReach
                            ? 'h-5 w-5 rounded-full bg-gold text-white text-[10px] flex items-center justify-center'
                            : 'h-5 w-5 rounded-full bg-gray-300'
                      }
                    >
                      {isClaimed ? '✓' : ''}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-gray-400">
              {CHECKPOINTS.map((value) => (
                <span key={`label-${value}`}>ครบ {formatPoints(value)}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 text-[10px] text-gray-400">
            <span>ต่ำสุด 300</span>
            <span>สูงสุด 3000</span>
          </div>
        </Card>

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
        </div>

        <div className="absolute left-0 right-0 bottom-0 px-4 pb-6 pt-4 bg-white rounded-b-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <div className="mx-auto w-full max-w-[343px]">
            <Link href="/game">
              <Button size="md" className="w-full rounded-full">
                ไปเล่นเกม
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
