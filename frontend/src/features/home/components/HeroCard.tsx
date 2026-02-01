import { ScoreDisplay } from './ScoreDisplay'
import { ProgressBar } from './ProgressBar'
import { CheckpointItem } from './CheckpointItem'

const CHECKPOINTS = [500, 1000, 5000, 10000]

interface HeroCardProps {
  totalPoints: number
  claimedCheckpoints: number[]
  onClaim?: (checkpoint: number) => Promise<void>
  loading?: boolean
  className?: string
}

export function HeroCard({
  totalPoints,
  claimedCheckpoints,
  onClaim,
  loading = false,
  className = '',
}: HeroCardProps) {
  const handleClaim = async (checkpoint: number) => {
    if (onClaim) {
      await onClaim(checkpoint)
    }
  }

  return (
    <div
      className={`rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden p-4 ${className}`}
      style={{ width: '343px', height: '200px' }}
    >
      {/* Score Display */}
      <ScoreDisplay totalPoints={totalPoints} />

      {/* Progress Bar */}
      <div className="mt-4">
        <ProgressBar totalPoints={totalPoints} checkpoints={CHECKPOINTS} />
      </div>

      {/* Checkpoints */}
      <div className="flex justify-between mt-3 px-1">
        {CHECKPOINTS.map((checkpoint) => (
          <CheckpointItem
            key={checkpoint}
            checkpoint={checkpoint}
            totalPoints={totalPoints}
            claimed={claimedCheckpoints.includes(checkpoint)}
            onClaim={() => handleClaim(checkpoint)}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}
