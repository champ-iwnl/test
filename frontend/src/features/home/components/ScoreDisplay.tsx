interface ScoreDisplayProps {
  totalPoints: number
  totalCheckpoint?: number
  className?: string
}

export function ScoreDisplay({ totalPoints, totalCheckpoint = 10000, className = '' }: ScoreDisplayProps) {
  return (
    <div className={`${className} w-full flex justify-end`}>
      <div className="text-right" style={{ width: '100%' }}>
        <div
          className="text-red-600"
          style={{
            fontFamily: 'Kanit',
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '24px',
            letterSpacing: '0px',
            textAlign: 'right',
            color: '#FF2428',
          }}
        >
          {`${totalPoints.toLocaleString()}/${totalCheckpoint.toLocaleString()}`}
        </div>
      </div>
    </div>
  )
}
