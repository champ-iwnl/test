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
      avatar={<img src="/images/avatar.svg" alt="avatar" style={{ width: 48, height: 48, borderRadius: 32, display: 'block' }} />}
      title={nickname}
      subtitle={`รางวัล: ${formatPoints(item.points_gained)} | เล่นเมื่อ ${formatDate(item.created_at)}`}
      timestamp=""
      className={className}
    />
  )
}
