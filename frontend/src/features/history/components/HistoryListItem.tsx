import { Card } from '@/components/ui/Card'
import Image from 'next/image'

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
  const fallbackAvatar = (
    <Image
      src="/images/avatar.svg"
      alt="avatar"
      width={48}
      height={48}
      style={{ borderRadius: 32, display: 'block' }}
    />
  )

  return (
    <Card
      className={`w-full flex items-center gap-[30px] pl-[15px] pr-4 py-3 border border-gray-200 shadow-none rounded-none ${className}`}
      style={{ minHeight: '72px', opacity: 1 }}
    >
      {/* Avatar */}
      <div
        className="flex items-center"
        style={{ width: 48, height: 48, minWidth: 48, marginTop: 2 }}
      >
        {avatar ?? fallbackAvatar}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-between">
        <div>
          <div className="text-[12px] font-semibold text-gray-800">{title}</div>
          <div className="text-[11px] text-gray-400">{subtitle}</div>
        </div>
        {timestamp ? (
          <div className="text-[11px] text-gray-400 text-right whitespace-nowrap">{timestamp}</div>
        ) : null}
      </div>
    </Card>
  )
}
