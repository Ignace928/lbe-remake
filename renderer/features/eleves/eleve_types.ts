import { z } from 'zod'

// Types basés sur le modèle Sequelize
export const eleveSchema = z.object({
  id_eleve: z.number(),
  matricule: z.string()
    .min(1, 'Le matricule est requis')
    .regex(/^\d+[MF]\/\d{2}$/, 'Format invalide. Ex: 123M/22'),
  nom_eleve: z.string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  post_nom_eleve: z.string().max(100, 'Le post-nom ne peut pas dépasser 100 caractères').optional(),
  sexe: z.enum(['M', 'F']),
  date_naissance: z.string()
    .min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().max(100, 'Le lieu ne peut pas dépasser 100 caractères').optional(),
  nationalite: z.string().max(50, 'La nationalité ne peut pas dépasser 50 caractères').optional(),
  adresse: z.string().optional(),
  telephone: z.string().max(20, 'Le téléphone ne peut pas dépasser 20 caractères').optional(),
  email: z.string().email('Email invalide').max(100, 'L\'email ne peut pas dépasser 100 caractères').optional(),
  nom_pere: z.string().max(100, 'Le nom du père ne peut pas dépasser 100 caractères').optional(),
  nom_mere: z.string().max(100, 'Le nom de la mère ne peut pas dépasser 100 caractères').optional(),
  profession_pere: z.string().max(100, 'La profession du père ne peut pas dépasser 100 caractères').optional(),
  profession_mere: z.string().max(100, 'La profession de la mère ne peut pas dépasser 100 caractères').optional(),
  etat: z.enum(['Actif', 'Inactif']),
  maladie: z.string().optional(),
  taille: z.number().min(0, 'La taille doit être positive').max(300, 'La taille semble irréaliste'),
  created_at: z.date()
})

export const createEleveSchema = eleveSchema.omit({ id_eleve: true, created_at: true }).extend({
  id_eleve: z.number().optional(), // Optionnel, seulement si la table est vide
  matricule: z.string()
    .min(1, 'Le matricule est requis')
    .regex(/^\d+[MF]\/\d{2}$/, 'Format invalide. Ex: 123M/22'),
  nom_eleve: z.string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  post_nom_eleve: z.string().max(100, 'Le post-nom ne peut pas dépasser 100 caractères').optional(),
  sexe: z.enum(['M', 'F']).default('M'),
  date_naissance: z.string()
    .min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().max(100, 'Le lieu ne peut pas dépasser 100 caractères').optional(),
  nationalite: z.string().max(50, 'La nationalité ne peut pas dépasser 50 caractères').optional(),
  adresse: z.string().optional(),
  telephone: z.string().max(20, 'Le téléphone ne peut pas dépasser 20 caractères').optional(),
  email: z.string().email('Email invalide').max(100, 'L\'email ne peut pas dépasser 100 caractères').optional(),
  nom_pere: z.string().max(100, 'Le nom du père ne peut pas dépasser 100 caractères').optional(),
  nom_mere: z.string().max(100, 'Le nom de la mère ne peut pas dépasser 100 caractères').optional(),
  profession_pere: z.string().max(100, 'La profession du père ne peut pas dépasser 100 caractères').optional(),
  profession_mere: z.string().max(100, 'La profession de la mère ne peut pas dépasser 100 caractères').optional(),
  etat: z.enum(['Actif', 'Inactif']).default('Actif'),
  maladie: z.string().optional(),
  taille: z.number().min(0, 'La taille doit être positive').max(300, 'La taille semble irréaliste').default(0)
})

export const updateEleveSchema = createEleveSchema.partial()

export type Eleve = z.infer<typeof eleveSchema>
export type CreateEleve = z.infer<typeof createEleveSchema>
export type UpdateEleve = z.infer<typeof updateEleveSchema>

// Types pour les réponses API
export interface EleveResponse {
  success: boolean
  message: string
  data: Eleve[]
}

export interface EleveSingleResponse {
  success: boolean
  message: string
  data: Eleve
}

// Types pour la réponse brute du backend (avant conversion)
export interface BackendEleveResponse {
  success: boolean
  message: string
  data: {
    id_eleve: number | string  // IPC peut convertir en string
    matricule: string
    nom_eleve: string
    post_nom_eleve?: string
    bapteme?: string
    sexe: string
    date_de_naissance: string  // Date sera convertie en string
    lieu_de_naissance?: string
    pere?: string
    mere?: string
    tel?: string
    adresse?: string
    tutelle?: string
    tel_tutelle?: string
    address_tutelle?: string
    religion?: string
    maladie?: string
    taille?: number
    created_at: string  // Date sera convertie en string
  }
}

export type EleveFieldErrors = {
  [K in keyof CreateEleve]?: string[]
}
