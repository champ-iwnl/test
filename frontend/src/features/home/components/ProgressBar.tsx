interface ProgressBarProps {
  totalPoints: number
  checkpoints: number[]
  className?: string
}

export function ProgressBar({ totalPoints, checkpoints, className = '' }: ProgressBarProps) {
  const maxCheckpoint = checkpoints[checkpoints.length - 1] || 10000
  const progressPercent = Math.min((totalPoints / maxCheckpoint) * 100, 100)

  return (
    <div className={`relative ${className}`}>
      {/* Background track */}
      <div
        className="w-full bg-gray-200"
        style={{
          height: '8px',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Progress fill */}
        <div
          className="bg-red transition-all duration-300"
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            borderRadius: '4px',
          }}
        />

        {/* Checkpoint markers */}
        {checkpoints.map((checkpoint) => {
          const position = (checkpoint / maxCheckpoint) * 100
          const isReached = totalPoints >= checkpoint

          return (
            <div
              key={checkpoint}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  isReached ? 'bg-red border-red' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
