import { HistoryListItem } from './HistoryListItem'
import { formatDate } from '@/utils/formatters'
import type { RewardHistoryItem as RewardHistoryItemType } from '@/types/api'

interface RewardHistoryItemProps {
  item: RewardHistoryItemType
  className?: string
}

export function RewardHistoryItem({ item, className }: RewardHistoryItemProps) {
  return (
    <HistoryListItem
      avatar={<img src="/images/avatar.svg" alt="avatar" style={{ width: 48, height: 48, borderRadius: 32, display: 'block' }} />}
      title={item.reward_name}
      subtitle="ได้รับเมื่อ"
      timestamp={formatDate(item.claimed_at)}
      className={className}
    />
  )
}
