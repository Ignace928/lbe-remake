import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loginUser } from './auth_service'
import { LoginCredentials, LoginResponse } from './auth_types'
import { useAuthStore } from '@/store/authStore'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Stocker les infos utilisateur complètes dans le store Zustand
        setUser(data.data)
        
        // Stocker les infos utilisateur dans le cache React Query
        queryClient.setQueryData(['auth', 'user'], data.data)
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })
}
// Hook pour nettoyer le storage lors de la déconnexion
export const useAuthLogout = () => {
  const logout = useAuthStore((state) => state.logout)
  
  return () => {
    logout()
    sessionStorage.removeItem('auth-storage')
  }
}
export const useAuthState = () => {
  // Utiliser uniquement le cache React Query pour l'état d'authentification
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => null,
    enabled: false, // Désactiver le fetch automatique
    staleTime: Infinity
  })
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error
  }
}
