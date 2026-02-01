'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { CtaButton } from '@/components/ui/CtaButton'
import { CtaFooter } from '@/components/ui/CtaFooter'
import { Modal } from '@/components/ui/Modal'
import { gameService } from '@/services/game.service'
import { usePlayerStore } from '@/store/playerStore'
import { formatPoints } from '@/utils/formatters'

const SEGMENTS = [300, 1000, 500, 3000]
const SPIN_CONFIG = {
  speedPerFrame: 26,
  settleDuration: 1800,
  extraRotations: 3,
  pointerAngle: 270,
  jitterMaxAngle: 44,
  jitterEdgeBias: 0.85,
}
const SEGMENT_CENTER_ANGLES: Record<number, number> = {
  1000: 315,
  500: 45,
  3000: 135,
  300: 225,
}

export default function GamePage() {
  const router = useRouter()
  const player = usePlayerStore((state) => state.player)
  const setPlayer = usePlayerStore((state) => state.setPlayer)

  const [mounted, setMounted] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSettling, setIsSettling] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [hasResult, setHasResult] = useState(false)
  const [pendingStop, setPendingStop] = useState(false)

  const rafRef = useRef<number | null>(null)
  const rotationRef = useRef(0)
  const pendingStopRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!player) {
      router.replace('/')
    }
  }, [mounted, player, router])

  const totalPoints = player?.total_points ?? 0

  const scoreText = useMemo(() => {
    return `${formatPoints(totalPoints)}/10,000`
  }, [totalPoints])

  const startSpinLoop = () => {
    const loop = () => {
      rotationRef.current = (rotationRef.current + SPIN_CONFIG.speedPerFrame) % 360
      setRotation(rotationRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const stopSpinLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const settleToResult = (points: number) => {
    const segmentAngle = 360 / SEGMENTS.length
    const index = Math.max(0, SEGMENTS.indexOf(points))
    const fallbackCenter = (360 - index * segmentAngle - segmentAngle / 2 + 360) % 360
    const centerAngle = SEGMENT_CENTER_ANGLES[points] ?? fallbackCenter
    const raw = Math.random()
    const bias = Math.pow(raw, SPIN_CONFIG.jitterEdgeBias)
    const sign = Math.random() < 0.5 ? -1 : 1
    const jitter = sign * bias * SPIN_CONFIG.jitterMaxAngle
    const targetAngle = (centerAngle + jitter + 360) % 360

    const current = rotationRef.current
    const normalized = (current % 360 + 360) % 360
    const currentCenter = (targetAngle + normalized) % 360
    const delta = (SPIN_CONFIG.pointerAngle - currentCenter + 360) % 360
    const finalRotation = current + 360 * SPIN_CONFIG.extraRotations + delta

    setIsSettling(true)
    setRotation(finalRotation)
    rotationRef.current = finalRotation

    window.setTimeout(() => {
      setIsSettling(false)
      setModalOpen(true)
    }, SPIN_CONFIG.settleDuration)
  }

  const spin = async () => {
    if (isSpinning || isStopping || !player) return

    setErrorMessage(null)
    setStatusMessage(null)
    setModalOpen(false)
    setResult(null)
    setHasResult(false)
    setPendingStop(false)
    pendingStopRef.current = false
    setIsSpinning(true)
    startSpinLoop()

    try {
      const response = await gameService.spin({ player_id: player.id })
      setResult(response.points_gained)
      setHasResult(true)
      setPlayer({
        id: player.id,
        nickname: player.nickname,
        total_points: response.total_points_after,
        created_at: player.created_at,
      })

      if (pendingStopRef.current) {
        pendingStopRef.current = false
        setPendingStop(false)
        setStatusMessage(null)
        stopSpinLoop()
        setIsSpinning(false)
        settleToResult(response.points_gained)
      }
    } catch (error: any) {
      stopSpinLoop()
      setIsSpinning(false)
      setHasResult(false)
      setPendingStop(false)
      pendingStopRef.current = false
      setErrorMessage(error?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const stopSpin = () => {
    if (!isSpinning || isStopping) return
    if (!hasResult || result === null) {
      setPendingStop(true)
      pendingStopRef.current = true
      setStatusMessage('กำลังสุ่มผล...')
      return
    }

    setIsStopping(true)
    stopSpinLoop()
    setIsSpinning(false)
    setIsStopping(false)
    setStatusMessage(null)
    settleToResult(result)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setResult(null)
    setHasResult(false)
    setErrorMessage(null)
    setStatusMessage(null)
    setIsSettling(false)
  }

  useEffect(() => {
    return () => stopSpinLoop()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container className="flex flex-col items-center justify-between bg-[#F8F1E7]">
        {/* Score display */}
        <div className="pt-8 text-center">
          <div className="text-lg font-semibold text-gray-800">คะแนนสะสม {scoreText}</div>
        </div>

        {/* Wheel container */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            <div
              className={
                isSettling
                  ? 'transition-transform duration-[2200ms] ease-[cubic-bezier(0.15,0.85,0.2,1)]'
                  : 'transition-transform duration-75 linear'
              }
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Image src="/images/spin-wheel.svg" alt="Spin wheel" width={320} height={320} priority />
            </div>

            <div className="absolute top-[-34px]">
              <Image src="/images/spin-pin.svg" alt="Pin" width={80} height={94} />
            </div>

            <button
              type="button"
              onClick={isSpinning ? stopSpin : spin}
              aria-label={isSpinning ? 'หยุดการหมุน' : 'เริ่มหมุน'}
              className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Image src="/images/spin-coin.svg" alt="Coin" width={72} height={72} className={isSpinning ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>

        {/* Button section */}
        <div className="pb-24">
          {isSpinning ? (
            <Button variant="secondary" size="sm" onClick={stopSpin} isLoading={isStopping} className="px-6" style={{ borderRadius: 0 }}>
              หยุด
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={spin} className="px-6" style={{ borderRadius: 0 }}>
              เริ่มหมุน
            </Button>
          )}

          {errorMessage && <div className="mt-3 text-sm text-red-500 text-center">{errorMessage}</div>}
          {statusMessage && !errorMessage && <div className="mt-3 text-sm text-gray-500 text-center">{statusMessage}</div>}
        </div>

        {/* Footer */}
        <CtaFooter>
          <Link href="/home">
            <CtaButton>กลับหน้าหลัก</CtaButton>
          </Link>
        </CtaFooter>
      </Container>

      {/* Result modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} showCloseButton>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800 mb-2">ได้รับ</div>
          <div className="text-gray-500 mb-6">{result ? `${formatPoints(result)} คะแนน` : '-'}</div>
          <Button size="sm" onClick={handleCloseModal} className="px-8" style={{ borderRadius: 0 }}>
            ปิด
          </Button>
        </div>
      </Modal>
    </div>
  )
}
