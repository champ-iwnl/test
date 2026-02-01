import { Card } from '@/components/ui/Card'

interface HistoryListItemProps {
  avatar?: React.ReactNode
  title: string
  subtitle: string
  timestamp: string
  className?: string
}

export function HistoryListItem({
  avatar,
  title,
  subtitle,
  timestamp,
  className = '',
}: HistoryListItemProps) {
  return (
    <Card
      noPadding
      className={`w-full flex items-center gap-3 border-b border-gray-100 ${className}`}
      style={{ height: '80px', opacity: 1, borderRadius: 0 }}
    >
      {/* Avatar */}
      {avatar && <div className="ml-4">{avatar}</div>}

      {/* Content area - 345×50 with justify-between */}
      <div
        style={{
          width: '300px',
          height: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: 1,
        }}
      >
        <div>
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          <div className="text-[11px] text-gray-400">{subtitle}</div>
        </div>
        <div className="text-[11px] text-gray-400">{timestamp}</div>
      </div>
    </Card>
  )
}
