import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const typeFraisSchema = z.object({
  id_type_frais: z.number(),
  libelle: z.string()
    .min(1, 'Le libellé est requis')
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères'),
  detail: z.string().optional(),
})

export const createTypeFraisSchema = typeFraisSchema.omit({ id_type_frais: true }).extend({
  libelle: z.string()
    .min(1, 'Le libellé est requis')
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères'),
  detail: z.string().optional(),
})

export const updateTypeFraisSchema = createTypeFraisSchema.partial()

export type TypeFrais = z.infer<typeof typeFraisSchema>
export type CreateTypeFrais = z.infer<typeof createTypeFraisSchema>
export type UpdateTypeFrais = z.infer<typeof updateTypeFraisSchema>

// Types pour les réponses API
export interface TypeFraisResponse {
  success: boolean
  message: string
  data: TypeFrais[]
}

export interface TypeFraisSingleResponse {
  success: boolean
  message: string
  data: TypeFrais
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendTypeFraisResponse {
  success: boolean
  message: string
  data: {
    id_type_frais: number
    libelle: string
    detail: string
  }
}

export type TypeFraisFieldErrors = {
  [K in keyof CreateTypeFrais]?: string[]
}
