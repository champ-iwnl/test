import { useEffect, useRef, useState } from 'react'
import { useSpinWheelConfig } from '@/config'

const SEGMENT_CENTER_ANGLES: Record<number, number> = {
  1000: 315,
  500: 45,
  3000: 135,
  300: 225,
}

const SEGMENTS = [300, 1000, 500, 3000]

interface UseSpinWheelOptions {
  onSpinComplete?: (points: number) => void
  onError?: (error: string) => void
}

export function useSpinWheel(options?: UseSpinWheelOptions) {
  // ใช้ config จาก YAML (public/config/app.yaml)
  const spinConfig = useSpinWheelConfig()

  const [isSpinning, setIsSpinning] = useState(false)
  const [isSettling, setIsSettling] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [hasResult, setHasResult] = useState(false)
  const [pendingStop, setPendingStop] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const rafRef = useRef<number | null>(null)
  const rotationRef = useRef(0)
  const pendingStopRef = useRef(false)

  const startSpinLoop = () => {
    const loop = () => {
      rotationRef.current = (rotationRef.current + spinConfig.speedPerFrame) % 360
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
    const bias = Math.pow(raw, spinConfig.jitterEdgeBias)
    const sign = Math.random() < 0.5 ? -1 : 1
    const jitter = sign * bias * spinConfig.jitterMaxAngle
    const targetAngle = (centerAngle + jitter + 360) % 360

    const current = rotationRef.current
    const normalized = (current % 360 + 360) % 360
    const currentCenter = (targetAngle + normalized) % 360
    const delta = (spinConfig.pointerAngle - currentCenter + 360) % 360
    const finalRotation = current + 360 * spinConfig.extraRotations + delta

    setIsSettling(true)
    setRotation(finalRotation)
    rotationRef.current = finalRotation

    window.setTimeout(() => {
      setIsSettling(false)
      if (options?.onSpinComplete) {
        options.onSpinComplete(points)
      }
    }, spinConfig.duration)
  }

  const startSpin = () => {
    if (isSpinning || isStopping) return

    setStatusMessage(null)
    setResult(null)
    setHasResult(false)
    setPendingStop(false)
    pendingStopRef.current = false
    setIsSpinning(true)
    startSpinLoop()
  }

  const setSpinResult = (points: number) => {
    setResult(points)
    setHasResult(true)

    if (pendingStopRef.current) {
      pendingStopRef.current = false
      setPendingStop(false)
      setStatusMessage(null)
      stopSpinLoop()
      setIsSpinning(false)
      settleToResult(points)
    }
  }

  const stopSpin = () => {
    if (!isSpinning || isStopping) return
    if (!hasResult || result === null) {
      setPendingStop(true)
      pendingStopRef.current = true
      return
    }

    setIsStopping(true)
    stopSpinLoop()
    setIsSpinning(false)
    setIsStopping(false)
    setStatusMessage(null)
    settleToResult(result)
  }

  const reset = () => {
    stopSpinLoop()
    setIsSpinning(false)
    setIsSettling(false)
    setIsStopping(false)
    setResult(null)
    setHasResult(false)
    setPendingStop(false)
    pendingStopRef.current = false
    setStatusMessage(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSpinLoop()
  }, [])

  return {
    isSpinning,
    isSettling,
    isStopping,
    rotation,
    result,
    statusMessage,
    startSpin,
    stopSpin,
    setSpinResult,
    reset,
  }
}
