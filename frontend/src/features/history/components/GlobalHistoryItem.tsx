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
      avatar={<div className="h-10 w-10 rounded-full bg-red" />}
      title={item.player_nickname}
      subtitle={`รางวัล: ${formatPoints(item.points_gained)}`}
      timestamp={formatDate(item.created_at)}
      className={className}
    />
  )
}
