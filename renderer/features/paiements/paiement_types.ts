import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const paiementSchema = z.object({
  id_paiement: z.number(),
  ref: z.string()
    .min(1, 'La référence est requise')
    .min(2, 'La référence doit contenir au moins 2 caractères')
    .max(50, 'La référence ne peut pas dépasser 50 caractères'),
  id_inscription: z.number(),
  id_type_frais: z.number(),
  montant_paye: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999.99, 'Le montant semble irréaliste'),
  date_paiement: z.date(),
})

export const createPaiementSchema = paiementSchema.omit({ id_paiement: true }).extend({
  ref: z.string()
    .min(1, 'La référence est requise')
    .min(2, 'La référence doit contenir au moins 2 caractères')
    .max(50, 'La référence ne peut pas dépasser 50 caractères'),
  id_inscription: z.number(),
  id_type_frais: z.number(),
  montant_paye: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999.99, 'Le montant semble irréaliste'),
  date_paiement: z.date(),
})

export const updatePaiementSchema = createPaiementSchema.partial()

export type Paiement = z.infer<typeof paiementSchema>
export type CreatePaiement = z.infer<typeof createPaiementSchema>
export type UpdatePaiement = z.infer<typeof updatePaiementSchema>

// Types pour les réponses API
export interface PaiementResponse {
  success: boolean
  message: string
  data: Paiement[]
}

export interface PaiementSingleResponse {
  success: boolean
  message: string
  data: Paiement
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendPaiementResponse {
  success: boolean
  message: string
  data: {
    id_paiement: number
    ref: string
    id_inscription: number
    id_type_frais: number
    montant_paye: number
    date_paiement: string  // Date sera convertie en string
  }
}

export type PaiementFieldErrors = {
  [K in keyof CreatePaiement]?: string[]
}
