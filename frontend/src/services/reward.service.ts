import api from '@/lib/axios'
import { RewardHistoryResponse, ClaimResponse } from '@/types/api'

export const rewardService = {
  getHistory: async (playerId: string) => {
    const response = await api.get<RewardHistoryResponse>(`/rewards/${playerId}`)
    return response.data
  },
  claimCheckpoint: async (playerId: string, checkpointVal: number) => {
    const response = await api.post<ClaimResponse>('/rewards/claim', {
      player_id: playerId,
      checkpoint_val: checkpointVal,
    })
    return response.data
  },
}
