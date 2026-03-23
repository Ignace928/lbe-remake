import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const tarifSchema = z.object({
  id_tarif: z.number(),
  id_classe: z.number(),
  id_annee: z.string(),
  id_type_frais: z.number(),
  montant_fixe: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999.99, 'Le montant semble irréaliste'),
})

export const createTarifSchema = tarifSchema.omit({ id_tarif: true }).extend({
  id_classe: z.number(),
  id_annee: z.string(),
  id_type_frais: z.number(),
  montant_fixe: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999.99, 'Le montant semble irréaliste'),
})

export const updateTarifSchema = createTarifSchema.partial()

export type Tarif = z.infer<typeof tarifSchema>
export type CreateTarif = z.infer<typeof createTarifSchema>
export type UpdateTarif = z.infer<typeof updateTarifSchema>

// Types pour les réponses API
export interface TarifResponse {
  success: boolean
  message: string
  data: Tarif[]
}

export interface TarifSingleResponse {
  success: boolean
  message: string
  data: Tarif
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendTarifResponse {
  success: boolean
  message: string
  data: {
    id_tarif: number
    id_classe: number
    id_annee: string
    id_type_frais: number
    montant_fixe: number
  }
}

export type TarifFieldErrors = {
  [K in keyof CreateTarif]?: string[]
}
