import api from '@/lib/axios'
import { RewardHistoryResponse } from '@/types/api'

export const rewardService = {
  getHistory: async (playerId: string) => {
    const response = await api.get<RewardHistoryResponse>(`/rewards/${playerId}`)
    return response.data
  },
}
