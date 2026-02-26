import { z } from 'zod'

export const loginSchema = z.object({
  nom_user: z.string()
    .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères'),
  mdp: z.string()
    .min(0, 'Le mot de passe peut être vide pour l\'utilisateur par défaut')
})

export type LoginCredentials = z.infer<typeof loginSchema>

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    id_user: number
    nom_user: string
    role: string
  }
}

export interface AuthState {
  user: {
    id_user: number
    nom_user: string
    role: string
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type LoginFieldErrors = {
  [K in keyof LoginCredentials]?: string[]
}
