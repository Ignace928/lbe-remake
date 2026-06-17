import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const classeSchema = z.object({
  id_classe: z.number(),
  nom_classe: z.string()
    .min(1, 'Le nom de la classe est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  niveau: z.string()
    .min(1, 'Le niveau est requis')
    .max(30, 'Le niveau ne peut pas dépasser 30 caractères'),
  delegue_1: z.number().nullable().optional(),
  delegue_2: z.number().nullable().optional(),
  meilleur_eleve: z.number().nullable().optional(),
  titulaire: z.string().max(100, 'Le titulaire ne peut pas dépasser 100 caractères').nullable().optional(),
})

export const createClasseSchema = classeSchema.omit({ id_classe: true }).extend({
  nom_classe: z.string()
    .min(1, 'Le nom de la classe est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  niveau: z.string()
    .min(1, 'Le niveau est requis')
    .max(30, 'Le niveau ne peut pas dépasser 30 caractères'),
  delegue_1: z.number().nullable().optional(),
  delegue_2: z.number().nullable().optional(),
  meilleur_eleve: z.number().nullable().optional(),
  titulaire: z.string().max(100, 'Le titulaire ne peut pas dépasser 100 caractères').nullable().optional(),
})

export const updateClasseSchema = createClasseSchema.partial()

export type Classe = z.infer<typeof classeSchema>
export type CreateClasse = z.infer<typeof createClasseSchema>
export type UpdateClasse = z.infer<typeof updateClasseSchema>

// Types pour les réponses API
export interface ClasseResponse {
  success: boolean
  message: string
  data: Classe[]
}

export interface ClasseSingleResponse {
  success: boolean
  message: string
  data: Classe
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendClasseResponse {
  success: boolean
  message: string
  data: {
    id_classe: number
    nom_classe: string
    niveau: string
    delegue_1: number | null
    delegue_2: number | null
    meilleur_eleve: number | null
    titulaire: string | null
  }
}

export type ClasseFieldErrors = {
  [K in keyof CreateClasse]?: string[]
}
