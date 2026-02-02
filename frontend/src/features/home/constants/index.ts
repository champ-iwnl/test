// Re-export checkpoints from reward feature
export { CHECKPOINTS, type Checkpoint } from '@/features/reward/constants'

// Pagination defaults
export const PAGINATION = {
  defaultLimit: 20,
  rootMargin: '300px',
  threshold: 0,
  maxRetryDelay: 4000,
  baseRetryDelay: 500,
} as const

// Tab IDs
export const TAB_IDS = {
  global: 'global',
  personal: 'personal',
  rewards: 'rewards',
} as const

export type TabId = keyof typeof TAB_IDS
