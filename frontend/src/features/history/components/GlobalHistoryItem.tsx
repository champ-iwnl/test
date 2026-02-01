import { HistoryListItem } from './HistoryListItem'
import { formatPoints, formatDate } from '@/utils/formatters'
import type { SpinLog } from '@/types/api'

interface GlobalHistoryItemProps {
  item: SpinLog
  className?: string
}

export function GlobalHistoryItem({ item, className }: GlobalHistoryItemProps) {
  return (
    <HistoryListItem
      avatar={<img src="/images/avatar.svg" alt="avatar" style={{ width: 48, height: 48, borderRadius: 32, display: 'block' }} />}
      title={item.player_nickname}
      subtitle={`รางวัล: ${formatPoints(item.points_gained)} | เล่นเมื่อ ${formatDate(item.created_at)}`}
      timestamp=""
      className={className}
    />
  )
}
