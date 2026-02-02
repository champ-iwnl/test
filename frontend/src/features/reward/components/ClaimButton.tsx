interface ClaimButtonProps {
  checkpointIndex?: number
  label?: string
  status: 'claimable' | 'claimed' | 'locked'
  onClaim?: () => void
  loading?: boolean
  className?: string
}

export function ClaimButton({
  checkpointIndex,
  label,
  status,
  onClaim,
  loading = false,
  className = '',
}: ClaimButtonProps) {
  const defaultLabel = label || `รับรางวัล ${checkpointIndex ?? ''}`
  const width = 68.99998474121094
  const height = 21.76318359375
  const borderRadius = 12.5

  if (status === 'claimed') {
    return (
      <div
        className={`inline-flex items-center justify-center text-xs ${className}`}
        style={{
          borderRadius: `${borderRadius}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: '#DDDDDD',
          color: '#8B8B8B',
          fontFamily: 'Kanit',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {`รับแล้ว`}
      </div>
    )
  }

  if (status === 'locked') {
    return (
      <div
        className={`inline-flex items-center justify-center text-xs ${className}`}
        style={{
          borderRadius: `${borderRadius}px`,
          width: `${width}px`,
          height: `${height}px`,
          background: '#DDDDDD',
          color: '#8B8B8B',
          fontFamily: 'Kanit',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {defaultLabel}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClaim}
      disabled={loading}
      className={`${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        width: `${width}px`,
        height: `${height}px`,
        background: '#FF0004',
        color: '#FFFFFF',
        border: 'none',
        fontFamily: 'Kanit',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading ? 'กำลังรับ...' : defaultLabel}
    </button>
  )
}
