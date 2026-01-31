import api from '@/lib/axios'
import { EnterRequest, EnterResponse, ProfileResponse } from '@/types/api'

export const authService = {
  enter: async (nickname: string) => {
    const response = await api.post<EnterResponse>('/players/enter', { nickname })
    return response.data
  },

  getProfile: async (id: string) => {
    const response = await api.get<ProfileResponse>(`/players/${id}`)
    return response.data
  }
}
