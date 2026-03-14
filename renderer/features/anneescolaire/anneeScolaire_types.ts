import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const anneeScolaireSchema = z.object({
  id_annee: z.string().uuid(),
  libelle: z.string()
    .min(1, 'Le libellé est requis')
    .min(3, 'Le libellé doit contenir au moins 3 caractères')
    .max(20, 'Le libellé ne peut pas dépasser 20 caractères')
})

export const createAnneeScolaireSchema = anneeScolaireSchema.omit({ id_annee: true }).extend({
  libelle: z.string()
    .min(1, 'Le libellé est requis')
    .min(3, 'Le libellé doit contenir au moins 3 caractères')
    .max(20, 'Le libellé ne peut pas dépasser 20 caractères')
})

export const updateAnneeScolaireSchema = anneeScolaireSchema.omit({ id_annee: true }).partial()

export type AnneeScolaire = z.infer<typeof anneeScolaireSchema>
export type CreateAnneeScolaire = z.infer<typeof createAnneeScolaireSchema>
export type UpdateAnneeScolaire = z.infer<typeof updateAnneeScolaireSchema>

// Types pour les réponses API
export interface AnneeScolaireResponse {
  success: boolean
  message: string
  data: AnneeScolaire[]
}

export interface AnneeScolaireSingleResponse {
  success: boolean
  message: string
  data: AnneeScolaire
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendAnneeScolaireResponse {
  success: boolean
  message: string
  data: {
    id_annee: string  // UUID
    libelle: string
  }
}

export type AnneeScolaireFieldErrors = {
  [K in keyof CreateAnneeScolaire]?: string[]
}
