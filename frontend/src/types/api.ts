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

export interface GlobalHistoryResponse {
  data: SpinLog[]
  total: number
  limit: number
  offset: number
}

// Rewards
export interface ClaimRequest {
  checkpoint_points: number
}

export interface ClaimResponse {
  success: boolean
  message: string
  points_claimed: number
}

// Game
export interface SpinRequest {
  bet_amount?: number // if needed in future
}

export interface SpinResponse {
  points_gained: number
  result_angle: number
  final_points: number
}
