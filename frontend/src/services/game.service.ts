import api from '@/lib/axios'
import { SpinRequest, SpinResponse } from '@/types/api'

export const gameService = {
  spin: async (request: SpinRequest) => {
    const response = await api.post<SpinResponse>('/game/spin', request)
    return response.data
  },
}
