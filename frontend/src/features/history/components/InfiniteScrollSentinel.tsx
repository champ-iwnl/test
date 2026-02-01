interface InfiniteScrollSentinelProps {
  loading?: boolean
  error?: string | null
  hasMore?: boolean
  onRetry?: () => void
  className?: string
}

export function InfiniteScrollSentinel({
  loading = false,
  error = null,
  hasMore = true,
  onRetry,
  className = '',
}: InfiniteScrollSentinelProps) {
  return (
    <div className={`mt-2 px-4 ${className}`}>
      {error ? (
        <div className="flex items-center justify-center gap-2 text-sm text-red-500">
          <span>{error}</span>
          {onRetry && (
            <button
              className="px-2 py-1 text-xs border border-red-200"
              onClick={onRetry}
              style={{ borderRadius: 0 }}
            >
              ลองใหม่
            </button>
          )}
        </div>
      ) : loading ? (
        <div className="text-center text-sm text-gray-400">กำลังโหลด...</div>
      ) : !hasMore ? (
        <div className="text-center text-xs text-gray-400">ไม่มีข้อมูลเพิ่มเติม</div>
      ) : null}
    </div>
  )
}
