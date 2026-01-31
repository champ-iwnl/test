import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Player } from '@/types/api'

interface PlayerState {
  player: Player | null
  isAuthenticated: boolean
  
  // Actions
  setPlayer: (player: Player) => void
  updatePoints: (points: number) => void
  logout: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      player: null,
      isAuthenticated: false,

      setPlayer: (player) => set({ player, isAuthenticated: true }),
      
      updatePoints: (points) => 
        set((state) => ({
          player: state.player 
            ? { ...state.player, total_points: points } 
            : null
        })),

      logout: () => set({ player: null, isAuthenticated: false }),
    }),
    {
      name: 'spin-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
