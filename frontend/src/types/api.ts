// Generic API Response
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Player / Auth
export interface EnterRequest {
  nickname: string
}

export interface Player {
  id: string
  nickname: string
  total_points: number
  created_at?: string
  updated_at?: string
}

export interface EnterResponse {
  id: string
  nickname: string
  total_points: number
  created_at: string
  is_new?: boolean
}

export interface ProfileResponse {
  id: string
  nickname: string
  total_points: number
  created_at: string
  claimed_checkpoints: number[]
}

// History
export interface SpinLog {
  id: string
  player_nickname: string
  points_gained: number
  source: string
  created_at: string
}

export interface PersonalSpinLog {
  id: string
  points_gained: number
  source: string
  created_at: string
}

// History responses (cursor-based)
export interface GlobalHistoryResponse {
  data: SpinLog[]
  next_cursor?: string
  has_more: boolean
}

export interface PersonalHistoryResponse {
  data: PersonalSpinLog[]
  next_cursor?: string
  has_more: boolean
}

// Rewards
export interface ClaimRequest {
  player_id: string
  checkpoint_val: number
}

export interface ClaimResponse {
  id: string
  checkpoint_val: number
  reward_name: string
  claimed_at: string
}

export interface RewardHistoryItem {
  id: string
  checkpoint_val: number
  reward_name: string
  reward_description: string
  claimed_at: string
}

export interface RewardHistoryResponse {
  data: RewardHistoryItem[]
}

// Game
export interface SpinRequest {
  player_id: string
}

export interface SpinResponse {
  spin_id: string
  points_gained: number
  total_points_after: number
}
