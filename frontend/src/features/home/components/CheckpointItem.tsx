import { ClaimButton } from './ClaimButton'

interface CheckpointItemProps {
  checkpoint: number
  totalPoints: number
  claimed: boolean
  onClaim?: () => void
  loading?: boolean
  className?: string
}

export function CheckpointItem({
  checkpoint,
  totalPoints,
  claimed,
  onClaim,
  loading = false,
  className = '',
}: CheckpointItemProps) {
  const isUnlocked = totalPoints >= checkpoint
  const status = claimed ? 'claimed' : isUnlocked ? 'claimable' : 'locked'

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* Checkpoint label */}
      <div
        className="text-gray-600"
        style={{
          fontFamily: 'Kanit',
          fontSize: '10px',
          fontWeight: 400,
          lineHeight: '120%',
        }}
      >
        {checkpoint.toLocaleString()}
      </div>

      {/* Claim button */}
      <ClaimButton checkpoint={checkpoint} status={status} onClaim={onClaim} loading={loading} />
    </div>
  )
}
