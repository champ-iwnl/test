// Checkpoint milestones for rewards
export const CHECKPOINTS = [500, 1000, 5000, 10000] as const

export type Checkpoint = (typeof CHECKPOINTS)[number]

// Reward messages
export const REWARD_MESSAGES = {
  claimSuccess: 'รับรางวัลสำเร็จ',
  claimError: 'ไม่สามารถรับรางวัลได้',
  alreadyClaimed: 'รับรางวัลนี้ไปแล้ว',
  notEnoughPoints: 'คะแนนไม่เพียงพอ',
} as const
