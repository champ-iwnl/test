import { ClaimButton } from '@/features/reward/components/ClaimButton'

interface CheckpointItemProps {
  checkpoint: number
  index?: number
  totalPoints: number
  claimed: boolean
  onClaim?: () => void
  loading?: boolean
  className?: string
  showLabel?: boolean
}

export function CheckpointItem({
  checkpoint,
  index = 1,
  totalPoints,
  claimed,
  onClaim,
  loading = false,
  className = '',
  showLabel = true,
}: CheckpointItemProps) {
  const isUnlocked = totalPoints >= checkpoint
  const status = claimed ? 'claimed' : isUnlocked ? 'claimable' : 'locked'

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* Checkpoint label - shown only when showLabel is true */}
      {showLabel && (
        <div
          className="text-gray-600 text-[11px]"
          style={{
            fontFamily: 'Kanit',
            fontSize: '11px',
            fontWeight: 400,
            lineHeight: '120%',
          }}
        >
          ครบ {checkpoint.toLocaleString()}
        </div>
      )}

      {/* Claim button */}
      <ClaimButton checkpointIndex={index} label={`รับรางวัล ${index}`} status={status} onClaim={onClaim} loading={loading} />
    </div>
  )
}
