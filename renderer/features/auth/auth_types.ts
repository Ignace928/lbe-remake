import { z } from 'zod'
import { UserWithoutPassword } from '@/features/users/user_types'

export const loginSchema = z.object({
  nom_user: z.string()
    .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
    .max(100, 'Le nom d\'utilisateur ne peut pas dépasser 100 caractères'),
  mdp: z.string()
    .min(0, 'Le mot de passe peut être vide pour l\'utilisateur par défaut')
})

export type LoginCredentials = z.infer<typeof loginSchema>

export interface LoginResponse {
  success: boolean
  message: string
  data: UserWithoutPassword
}

export interface AuthState {
  user: UserWithoutPassword | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type LoginFieldErrors = {
  [K in keyof LoginCredentials]?: string[]
}
