import { HistoryListItem } from './HistoryListItem'
import { formatDate } from '@/utils/formatters'
import type { RewardHistoryItem as RewardHistoryItemType } from '@/types/api'
import Image from 'next/image'

interface RewardHistoryItemProps {
  item: RewardHistoryItemType
  className?: string
}

export function RewardHistoryItem({ item, className }: RewardHistoryItemProps) {
  return (
    <HistoryListItem
      avatar={<Image src="/images/avatar.svg" alt="avatar" width={48} height={48} style={{ borderRadius: 32, display: 'block' }} />}
      title={item.reward_name}
      subtitle="ได้รับเมื่อ"
      timestamp={formatDate(item.claimed_at)}
      className={className}
    />
  )
}
