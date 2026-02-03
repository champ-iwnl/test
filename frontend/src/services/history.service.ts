import api from '@/lib/axios'
import { GlobalHistoryResponse, PersonalHistoryResponse } from '@/types/api'

export const historyService = {
  // Global history (cursor-based)
  getGlobalHistory: async (limit = 20, cursor?: string) => {
    const response = await api.get<GlobalHistoryResponse>('/history/global', {
      params: { limit, ...(cursor && { cursor }) },
    })
    return response.data
  },

  // Personal history (cursor-based)
  getPersonalHistory: async (playerId: string, limit = 20, cursor?: string) => {
    const response = await api.get<PersonalHistoryResponse>(`/history/${playerId}`, {
      params: { limit, ...(cursor && { cursor }) },
    })
    return response.data
  },
}
