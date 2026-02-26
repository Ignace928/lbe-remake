import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginUser } from './auth_service'
import { LoginCredentials, LoginResponse } from './auth_types'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        // Stocker les infos utilisateur dans le cache ou localStorage si nécessaire
        localStorage.setItem('user', JSON.stringify(data.data))
        queryClient.setQueryData(['auth', 'user'], data.data)
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })
}

export const useAuthState = () => {
  // Pour l'instant, simple vérification localStorage
  const user = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: false,
    error: null
  }
}
