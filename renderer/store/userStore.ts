import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, CreateUser, UpdateUser } from '@/features/users/user_types'

interface UserStore {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
  addUser: (user: User) => void
  updateUser: (id: number, user: UpdateUser) => void
  deleteUser: (id: number) => void
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
      
      addUser: (user) => set((state) => ({
        ...state,
        users: [...state.users, user]
      })),
      
      updateUser: (id, userData) => set((state) => ({
        ...state,
        users: state.users.map(user => 
          user.id_user === id ? { ...user, ...userData } : user
        )
      })),
      
      deleteUser: (id) => set((state) => ({
        ...state,
        users: state.users.filter(user => user.id_user !== id),
        currentUser: state.currentUser?.id_user === id ? null : state.currentUser
      })),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      fetchUsers: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simuler une récupération depuis l'API
          // En pratique, vous appelleriez votre service API ici
          const response = await window.ipc.user.getAll(false)
          
          if (response.success) {
            set({ 
              users: response.data,
              isLoading: false,
              error: null 
            })
          } else {
            set({ 
              isLoading: false,
              error: response.message || 'Erreur lors de la récupération des utilisateurs'
            })
          }
        } catch (error) {
          set({ 
            isLoading: false,
            error: error.message || 'Erreur réseau'
          })
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Pas besoin de hasHydrated ici car on utilise les données directement
        }
      }
    }
  )
)

// Selectors pour un accès facile aux données
export const useUsers = () => useUserStore((state) => state.users)
export const useCurrentUser = () => useUserStore((state) => state.currentUser)
export const useUserLoading = () => useUserStore((state) => state.isLoading)
export const useUserError = () => useUserStore((state) => state.error)
