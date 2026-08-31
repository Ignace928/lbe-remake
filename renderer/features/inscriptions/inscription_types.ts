import { z } from 'zod'
<<<<<<< HEAD
export interface getAllThisYearParams{
  cursor?: number
  limit?: number
  id_anne?: string
  id_classe?: number
}
export interface getAllThisYearDataType{
  rows: Inscription[]
  pagination: {
    cursor: number
    hasMore: boolean
    totalCount: number
    currentBatchSize: number,
    limit: number
  }
}
// Types pour les associations
export const classeSchema = z.object({
  id_classe: z.number().optional(),
  nom_classe: z.string().optional(),
  niveau: z.string().optional(),
})

export const eleveSchema = z.object({
  id_eleve: z.number().optional(),
  matricule: z.string().optional(),
  nom_eleve: z.string().optional(),
  post_nom_eleve: z.string().optional(),
  sexe: z.string().optional().optional(),
})

export const anneeScolaireSchema = z.object({
  id_annee: z.string().optional(),
  libelle: z.string().optional(),
})

// Type pour la structure brute du backend (avec dataValues)
export const backendInscriptionSchema = z.object({
  dataValues: z.object({
    id_inscription: z.number(),
    id_classe: z.number(),
    id_eleve: z.number(),
    id_annee: z.string(),
    somme: z.number(),
    passant: z.boolean(),
    classe: classeSchema.nullable(),
    eleve: eleveSchema.nullable(),
    anneeScolaire: anneeScolaireSchema.nullable(),
  }),
  // Propriétés directes (peuvent être undefined)
  id_inscription: z.number().optional(),
  id_classe: z.number().optional(),
  id_eleve: z.number().optional(),
  id_annee: z.string().optional(),
  somme: z.number().optional(),
  passant: z.boolean().optional(),
  classe: z.any().optional(),
  eleve: z.any().optional(),
  anneeScolaire: z.any().optional(),
})

// Type final pour le frontend (après conversion)
=======

// Types basés sur le modèle Sequelize
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export const inscriptionSchema = z.object({
  id_inscription: z.number(),
  id_classe: z.number(),
  id_eleve: z.number(),
  id_annee: z.string(),
<<<<<<< HEAD
  somme: z.number(),
  passant: z.boolean(),
  classe: classeSchema.nullable(),
  eleve: eleveSchema.nullable(),
  anneeScolaire: anneeScolaireSchema.nullable(),
})

export const createInscriptionSchema = z.object({
  id_inscription: z.number().optional(),
  id_classe: z.number().min(1, "Veuillez choisir une classe valide"),
  id_eleve: z.number().min(1,"Veuillez choisir un élève"),
  id_annee: z.string(),
  somme: z.number().default(0),
=======
  passant: z.boolean(),
})

export const createInscriptionSchema = inscriptionSchema.omit({ id_inscription: true }).extend({
  id_classe: z.number(),
  id_eleve: z.number(),
  id_annee: z.string(),
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  passant: z.boolean().default(true),
})

export const updateInscriptionSchema = createInscriptionSchema.partial()

export type Inscription = z.infer<typeof inscriptionSchema>
<<<<<<< HEAD

=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export type CreateInscription = z.infer<typeof createInscriptionSchema>
export type UpdateInscription = z.infer<typeof updateInscriptionSchema>

// Types pour les réponses API
export interface InscriptionResponse {
  success: boolean
  message: string
  data: Inscription[]
}

<<<<<<< HEAD
export interface getAllThisYearResult {
  success: boolean
  message: string
  data: {
    rows: Inscription[]
    pagination: {
      cursor: number
      hasMore: boolean
      totalCount: number
      currentBatchSize: number,
      limit: number
    }
  }
}

=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export interface InscriptionSingleResponse {
  success: boolean
  message: string
  data: Inscription
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendInscriptionResponse {
  success: boolean
  message: string
<<<<<<< HEAD
  data: z.infer<typeof backendInscriptionSchema>
}

// Type pour les données brutes du backend dans getAllThisYear
export interface BackendInscriptionData {
  id_inscription: number
  id_classe: number
  id_eleve: number
  id_annee: string
  somme: number
  passant: boolean
  classe?: z.infer<typeof classeSchema>
  eleve?: z.infer<typeof eleveSchema>
  anneeScolaire?: z.infer<typeof anneeScolaireSchema>
=======
  data: {
    id_inscription: number
    id_classe: number
    id_eleve: number
    id_annee: string
    passant: boolean
  }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}

export type InscriptionFieldErrors = {
  [K in keyof CreateInscription]?: string[]
}
