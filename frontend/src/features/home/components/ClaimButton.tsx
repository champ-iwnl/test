interface ClaimButtonProps {
  checkpoint: number
  status: 'claimable' | 'claimed' | 'locked'
  onClaim?: () => void
  loading?: boolean
  className?: string
}

export function ClaimButton({
  checkpoint,
  status,
  onClaim,
  loading = false,
  className = '',
}: ClaimButtonProps) {
  if (status === 'claimed') {
    return (
      <div
        className={`inline-flex items-center justify-center px-3 py-1 text-xs text-green-600 bg-green-50 border border-green-200 ${className}`}
        style={{ borderRadius: '4px' }}
      >
        ✓ รับแล้ว
      </div>
    )
  }

  if (status === 'locked') {
    return (
      <div
        className={`inline-flex items-center justify-center px-3 py-1 text-xs text-gray-400 bg-gray-100 border border-gray-200 ${className}`}
        style={{ borderRadius: '4px' }}
      >
        🔒 ล็อค
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClaim}
      disabled={loading}
      className={`inline-flex items-center justify-center px-3 py-1 text-xs text-white bg-red hover:bg-red/90 border border-red disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {loading ? 'กำลังรับ...' : 'รับ'}
    </button>
  )
}
