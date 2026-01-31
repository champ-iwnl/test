import api from '@/lib/axios'
import { GlobalHistoryResponse, PersonalHistoryResponse } from '@/types/api'

export const historyService = {
  getGlobalHistory: async (limit = 100, offset = 0) => {
    const response = await api.get<GlobalHistoryResponse>('/history/global', {
      params: { limit, offset },
    })
    return response.data
  },

  getPersonalHistory: async (playerId: string, limit = 100, offset = 0) => {
    const response = await api.get<PersonalHistoryResponse>(`/history/${playerId}`, {
      params: { limit, offset },
    })
    return response.data
  },
}
