import { HistoryListItem } from './HistoryListItem'
import { formatPoints, formatDate } from '@/utils/formatters'
import type { PersonalSpinLog } from '@/types/api'

interface PersonalHistoryItemProps {
  item: PersonalSpinLog
  nickname: string
  className?: string
}

export function PersonalHistoryItem({ item, nickname, className }: PersonalHistoryItemProps) {
  return (
    <HistoryListItem
      avatar={<div className="h-10 w-10 rounded-full bg-red" />}
      title={nickname}
      subtitle={`รางวัล: ${formatPoints(item.points_gained)}`}
      timestamp={formatDate(item.created_at)}
      className={className}
    />
  )
}
