import { z } from 'zod'

export const userSchema = z.object({
  id_user: z.number().optional(),
  nom_user: z.string()
    .min(1, 'Le nom d\'utilisateur est requis')
    .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères'),
  mdp: z.string()
    .min(0, 'Le mot de passe peut être vide')
    .max(255, 'Le mot de passe ne peut pas dépasser 255 caractères'),
  role: z.enum(['admin', 'professeur', 'secretaire'])
})

export const createUserSchema = userSchema.omit({ id_user: true }).extend({
  mdp: z.string()
    .min(1, 'Le mot de passe est requis pour la création')
    .max(255, 'Le mot de passe ne peut pas dépasser 255 caractères')
})

export const updateUserSchema = userSchema.omit({ id_user: true }).partial()

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

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

export type UserFieldErrors = {
  [K in keyof CreateUser]?: string[]
}
