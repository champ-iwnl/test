import React, { useState } from 'react'
import Image from 'next/image'
import { ScoreDisplay } from './ScoreDisplay'
import { ProgressBar } from './ProgressBar'
import { ClaimButton } from './ClaimButton'

const CHECKPOINTS = [500, 1000, 10000]

interface HeroCardProps {
  totalPoints: number
  claimedCheckpoints: number[]
  onClaim?: (checkpoint: number) => Promise<void>
  loading?: boolean
  className?: string
  style?: React.CSSProperties
}

export function HeroCard({
  totalPoints,
  claimedCheckpoints,
  onClaim,
  loading = false,
  className = '',
  style = {},
}: HeroCardProps) {
  const [claimingCheckpoint, setClaimingCheckpoint] = useState<number | null>(null)
  const maxCheckpoint = CHECKPOINTS[CHECKPOINTS.length - 1]
  const GROUP_WIDTH = '100%'
  const CUSTOM_POS: Record<number, number> = { 0: 0, 500: 10, 1000: 45, 10000: 100 }
  const TRACK_LEFT_OFFSET = 'max(calc(10% - 34.5px), 0px)'
  const TRACK_WIDTH = 'calc(100% - max(calc(10% - 34.5px), 0px))'

  const getProgressPosition = (points: number) => {
    const clamped = Math.max(0, Math.min(points, maxCheckpoint))
    const sorted = [...CHECKPOINTS].sort((a, b) => a - b)
    const anchors = [0, ...sorted]

    for (let i = 0; i < anchors.length - 1; i += 1) {
      const start = anchors[i]
      const end = anchors[i + 1]
      if (clamped <= end) {
        const startPos = CUSTOM_POS[start] ?? (start / maxCheckpoint) * 100
        const endPos = CUSTOM_POS[end] ?? (end / maxCheckpoint) * 100
        const ratio = end === start ? 0 : (clamped - start) / (end - start)
        return startPos + (endPos - startPos) * ratio
      }
    }

    return 100
  }

  const progressPercent = Math.min(100, Math.max(0, getProgressPosition(totalPoints)))
  const avatarTransform = progressPercent <= 0 ? 'translateX(0) translateY(-50%)' : progressPercent >= 100 ? 'translateX(-100%) translateY(-50%)' : 'translateX(-50%) translateY(-50%)'
  const ICON_HIDE_THRESHOLD = 2
  const shouldHideAvatar = CHECKPOINTS.some((checkpoint) => {
    const pos = CUSTOM_POS[checkpoint] ?? (checkpoint / maxCheckpoint) * 100
    return Math.abs(progressPercent - pos) <= ICON_HIDE_THRESHOLD
  })

  const handleClaim = async (checkpoint: number) => {
    if (!onClaim) return
    try {
      setClaimingCheckpoint(checkpoint)
      await onClaim(checkpoint)
    } finally {
      setClaimingCheckpoint(null)
    }
  }

  return (
    <div
      className={`rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden p-4 ${className}`}
      style={{ width: 'clamp(300px, 92%, 500px)', height: '200px', ...style }}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-end mb-2">
        {/* Share button */}
        <button
          style={{
            width: '70px',
            height: '22px',
            position: 'relative',
            top: '-1px',
            left: '-6%',
            borderRadius: '0px 20px 20px 0px',
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            fontFamily: 'Kanit',
            fontWeight: 500,
            fontSize: '10px',
            lineHeight: '16px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          แชร์คะแนน
        </button>

        {/* Right side text */}
        <div className="flex flex-col">
          <div
            className="text-gray-600"
            style={{ fontFamily: 'Kanit', fontWeight: 600, fontSize: '16px', textAlign: 'right' }}
          >
            สะสมคะแนน
          </div>
          <div className="text-gray-500" style={{ fontFamily: 'Kanit', fontWeight: 500, fontSize: '14px', textAlign: 'right' }}>
            คะแนนครบ 10,000 รับของขวัญ 1 รายการ
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="mt-1">
        <ScoreDisplay totalPoints={totalPoints} totalCheckpoint={maxCheckpoint} />
      </div>

      {/* Centered group: labels, tube, icons, buttons */}
      <div className="w-full flex justify-center">
        <div style={{ width: GROUP_WIDTH, position: 'relative', margin: '0 auto' }}>

          {/* Labels (top) */}
          <div style={{ position: 'relative', height: 29 }}>
            {CHECKPOINTS.map((checkpoint) => {
              const CUSTOM_POS: Record<number, number> = { 500: 10, 1000: 45, 10000: 100 }
              const pos = CUSTOM_POS[checkpoint] ?? (checkpoint / maxCheckpoint) * 100
              const isStart = pos <= 1
              const isEnd = pos >= 99
              const leftStyle = isStart ? '0%' : isEnd ? '100%' : `${pos}%`
              const transformStyle = isStart ? 'translateX(0)' : isEnd ? 'translateX(-100%)' : 'translateX(-50%)'

              return (
                <div key={`label-${checkpoint}`} style={{ position: 'absolute', left: leftStyle, top: 15, transform: transformStyle }}>
                  <div style={{ fontFamily: 'Kanit', fontSize: 11, fontWeight: 400, color: '#8A8B8C', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    ครบ {checkpoint.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress tube */}
          <div style={{ position: 'relative', height: 50, marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: GROUP_WIDTH, position: 'relative' }}>
              <div style={{ position: 'relative', width: TRACK_WIDTH, left: TRACK_LEFT_OFFSET }}>
                <ProgressBar totalPoints={totalPoints} checkpoints={CHECKPOINTS} width={'100%'} height={9} showMarkers={false} progressPercent={progressPercent} />

                {/* Player indicator aligned to track */}
                {!shouldHideAvatar && (
                  <div style={{ position: 'absolute', left: `${progressPercent}%`, top: '4.5px', transform: avatarTransform, zIndex: 30 }}>
                    <img src="/images/player.svg" alt="current-score" style={{ width: 20, height: 20 }} />
                  </div>
                )}
              </div>

              {/* Icons - positioned on top of the tube */}
              {CHECKPOINTS.map((checkpoint) => {
                const CUSTOM_POS: Record<number, number> = { 500: 10, 1000: 45, 10000: 100 }
                const pos = CUSTOM_POS[checkpoint] ?? (checkpoint / maxCheckpoint) * 100
                const isStart = pos <= 1
                const isEnd = pos >= 99
                const leftStyle = isStart ? '0%' : isEnd ? '100%' : `${pos}%`
                const transformStyle = isStart ? 'translateX(0) translateY(-50%)' : isEnd ? 'translateX(-100%) translateY(-50%)' : 'translateX(-50%) translateY(-50%)'
                const isClaimed = claimedCheckpoints.includes(checkpoint)
                const isEligible = totalPoints >= checkpoint

                // Coin for 10000 checkpoint - positioned at 100% like button 3
                if (checkpoint === 10000) {
                  return (
                    <div 
                      key={`coin-10000`} 
                      style={{ 
                        position: 'absolute', 
                        left: leftStyle,
                        top: '4.5px',
                        transform: transformStyle,
                        zIndex: 50,
                        width: 32,
                        height: 32
                      }}
                    >
                      <img 
                        src="/images/spin-coin.svg" 
                        alt="coin" 
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          display: 'block'
                        }} 
                      />
                    </div>
                  )
                }

                // Check icons for other checkpoints - on top of the tube
                return (
                  <div 
                    key={`icon-${checkpoint}`} 
                    style={{ 
                      position: 'absolute', 
                      left: leftStyle, 
                      top: '4.5px',
                      transform: transformStyle, 
                      zIndex: 40 
                    }}
                  >
                    {isEligible && !isClaimed ? (
                      <img src="/images/check-geen.svg" alt="eligible" style={{ width: 20, height: 20 }} />
                    ) : (
                      <img src="/images/check-gray.svg" alt="claimed-or-locked" style={{ width: 20, height: 20 }} />
                    )}
                  </div>
                )
              })}

            </div>
          </div>

          {/* Claim buttons aligned under the tube */}
          <div style={{ position: 'relative', height: 34, marginTop: -10 }}>
            {CHECKPOINTS.map((checkpoint, idx) => {
              const CUSTOM_POS: Record<number, number> = { 500: 10, 1000: 45, 10000: 100 }
              const pos = CUSTOM_POS[checkpoint] ?? (checkpoint / maxCheckpoint) * 100
              const isStart = pos <= 1
              const isEnd = pos >= 99
              const leftStyle = isStart ? '0%' : isEnd ? '100%' : `${pos}%`
              const transformStyle = isStart ? 'translateX(0) translateY(0)' : isEnd ? 'translateX(-100%) translateY(0)' : 'translateX(-50%) translateY(0)'

              // While loading profile, show all buttons as locked to prevent flash
              if (loading) {
                return (
                  <div key={`btn-${checkpoint}`} style={{ position: 'absolute', left: leftStyle, top: 0, transform: transformStyle }}>
                    <ClaimButton checkpointIndex={idx + 1} status="locked" loading={false} onClaim={() => {}} />
                  </div>
                )
              }

              const isClaimed = claimedCheckpoints.includes(checkpoint)
              const isEligible = totalPoints >= checkpoint
              const status: 'claimed' | 'claimable' | 'locked' = isClaimed ? 'claimed' : isEligible ? 'claimable' : 'locked'

              return (
                <div key={`btn-${checkpoint}`} style={{ position: 'absolute', left: leftStyle, top: 0, transform: transformStyle }}>
                  <ClaimButton checkpointIndex={idx + 1} status={status} loading={claimingCheckpoint === checkpoint} onClaim={() => handleClaim(checkpoint)} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
