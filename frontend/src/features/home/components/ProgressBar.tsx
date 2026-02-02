interface ProgressBarProps {
  totalPoints: number
  checkpoints: number[]
  width?: number | string
  height?: number
  showMarkers?: boolean
  progressPercent?: number
  className?: string
}

export function ProgressBar({ totalPoints, checkpoints, width = '100%', height = 9, showMarkers = true, progressPercent, className = '' }: ProgressBarProps) {
  const maxCheckpoint = checkpoints[checkpoints.length - 1] || 10000
  const computedPercent = Math.min((totalPoints / maxCheckpoint) * 100, 100)
  const currentPercent = typeof progressPercent === 'number' ? progressPercent : computedPercent

  const trackStyle: React.CSSProperties = {
    height: `${height}px`,
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    width: typeof width === 'number' ? `${width}px` : width,
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background track */}
      <div
        className="bg-gray-200 mx-auto"
        style={trackStyle}
      >
        {/* Progress fill (gradient) */}
        <div
          className="transition-all duration-300"
          style={{
            height: '100%',
            width: `${currentPercent}%`,
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #FF8158 0%, #FF8902 159.71%)',
          }}
        />

        {showMarkers ? (
          <>
            {/* Current position marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${currentPercent}%` }}
            >
              <div className="w-5 h-5 rounded-full shadow-md border-2 border-white" style={{ background: '#FF8158' }} />
            </div>

            {/* Checkpoint markers (use custom visual positions) */}
            {checkpoints.map((checkpoint) => {
              const CUSTOM_POS: Record<number, number> = {
                500: 10,
                1000: 45,
                10000: 100,
              }
              const position = CUSTOM_POS[checkpoint] ?? (checkpoint / maxCheckpoint) * 100
              const isReached = totalPoints >= checkpoint

              return (
                <div
                  key={checkpoint}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      isReached ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              )
            })}
          </>
        ) : null}
      </div>
    </div>
  )
}
