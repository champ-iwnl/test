interface ScoreDisplayProps {
  totalPoints: number
  className?: string
}

export function ScoreDisplay({ totalPoints, className = '' }: ScoreDisplayProps) {
  return (
    <div className={`${className}`}>
      <div
        className="text-gray-500"
        style={{
          fontFamily: 'Kanit',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '120%',
        }}
      >
        คะแนนของฉัน
      </div>
      <div
        className="text-red"
        style={{
          fontFamily: 'Kanit',
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: '120%',
          marginTop: '4px',
        }}
      >
        {totalPoints.toLocaleString()} คะแนน
      </div>
    </div>
  )
}
