import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const userSchema = z.object({
  id_user: z.number(),
  nom_user: z.string()
    .min(1, 'Le nom d\'utilisateur est requis')
    .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
    .max(100, 'Le nom d\'utilisateur ne peut pas dépasser 100 caractères'),
  mdp: z.string()
    .min(0, 'Le mot de passe peut être vide')
    .max(255, 'Le mot de passe ne peut pas dépasser 255 caractères'),
  role: z.enum(['admin', 'professeur', 'secretaire'])
})

// Type sans mot de passe pour les réponses API
export const userWithoutPasswordSchema = z.object({
  id_user: z.number(),
  nom_user: z.string()
    .min(1, 'Le nom d\'utilisateur est requis')
    .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
    .max(100, 'Le nom d\'utilisateur ne peut pas dépasser 100 caractères'),
  role: z.enum(['admin', 'professeur', 'secretaire'])
})

export const createUserSchema = userSchema.omit({ id_user: true }).extend({
  mdp: z.string()
    .min(1, 'Le mot de passe est requis pour la création')
    .max(255, 'Le mot de passe ne peut pas dépasser 255 caractères')
})

export const updateUserSchema = userSchema.omit({ id_user: true }).partial()

export type User = z.infer<typeof userSchema>
export type UserWithoutPassword = z.infer<typeof userWithoutPasswordSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

// Types pour les réponses API (compatibles avec le backend)
export interface UserResponse {
  success: boolean
  message: string
  data: User[]
}

export interface UserSingleResponse {
  success: boolean
  message: string
  data: User
}

// Types pour les réponses API sans mot de passe
export interface UserWithoutPasswordResponse {
  success: boolean
  message: string
  data: UserWithoutPassword[]
}

export interface UserSingleWithoutPasswordResponse {
  success: boolean
  message: string
  data: UserWithoutPassword
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendUserResponse {
  success: boolean
  message: string
  data: {
    id_user: number | string  // IPC peut convertir en string
    nom_user: string
    role: string
  }
}

export type UserFieldErrors = {
  [K in keyof CreateUser]?: string[]
}
