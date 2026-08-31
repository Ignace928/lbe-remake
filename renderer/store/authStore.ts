import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserWithoutPassword } from '@/features/users/user_types'

interface AuthStore {
  user: UserWithoutPassword | null
  isAuthenticated: boolean
  setUser: (user: UserWithoutPassword | null) => void
  logout: () => void
  hasHydrated: boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
        }
      }
    }
  )
)

<<<<<<< HEAD
=======

>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
