import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const inscriptionSchema = z.object({
  id_inscription: z.number(),
  id_classe: z.number(),
  id_eleve: z.number(),
  id_annee: z.string(),
  passant: z.boolean(),
})

export const createInscriptionSchema = inscriptionSchema.omit({ id_inscription: true }).extend({
  id_classe: z.number(),
  id_eleve: z.number(),
  id_annee: z.string(),
  passant: z.boolean().default(true),
})

export const updateInscriptionSchema = createInscriptionSchema.partial()

export type Inscription = z.infer<typeof inscriptionSchema>
export type CreateInscription = z.infer<typeof createInscriptionSchema>
export type UpdateInscription = z.infer<typeof updateInscriptionSchema>

// Types pour les réponses API
export interface InscriptionResponse {
  success: boolean
  message: string
  data: Inscription[]
}

export interface InscriptionSingleResponse {
  success: boolean
  message: string
  data: Inscription
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendInscriptionResponse {
  success: boolean
  message: string
  data: {
    id_inscription: number
    id_classe: number
    id_eleve: number
    id_annee: string
    passant: boolean
  }
}

export type InscriptionFieldErrors = {
  [K in keyof CreateInscription]?: string[]
}
