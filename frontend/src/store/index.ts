import { create } from 'zustand'
import { Player } from '@/types'

interface AppStore {
  user: Player | null
  setUser: (user: Player | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))