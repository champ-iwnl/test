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
      avatar={<div className="h-10 w-10 rounded-full bg-red" />}
      title={item.reward_name}
      subtitle="ได้รับเมื่อ"
      timestamp={formatDate(item.claimed_at)}
      className={className}
    />
  )
}
