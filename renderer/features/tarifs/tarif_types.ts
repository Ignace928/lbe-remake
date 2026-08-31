import { z } from 'zod'

<<<<<<< HEAD
// ─── Schémas de base ──────────────────────────────────────────────────────────

export const tarifSchema = z.object({
  id_tarif: z.number(),
  id_classe: z.number(),
  id_type_frais: z.number(),
  montant_fixe: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999999999999.99, 'Le montant semble irréaliste'),
})

export const createTarifSchema = tarifSchema.omit({ id_tarif: true }).extend({
  id_classe: z.number().min(1, "Veuillez choisir une classe"),
  id_type_frais: z.number().min(1, "Veuillez choisir un Type de Frais"),
  montant_fixe: z.number()
    .min(0, 'Le montant doit être positif')
    .max(999999999999999.99, 'Le montant semble irréaliste'),
=======
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
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
})

export const updateTarifSchema = createTarifSchema.partial()

<<<<<<< HEAD
// ─── Schéma enrichi (réponse GET avec jointures) ──────────────────────────────

export const allTarifBackendSchema = tarifSchema.extend({
  classe: z.object({
    id_classe: z.number(),
    nom_classe: z.string(),
    niveau: z.string(),
  }),
  typeFrais: z.object({
    id_type_frais: z.number(),
    libelle: z.string(),
    detail: z.string(),
  }),
})

export type allTarifSingleType = z.infer<typeof allTarifBackendSchema>

// ─── Types exportés ───────────────────────────────────────────────────────────

/**
 * Tarif = version enrichie avec les jointures classe et typeFrais.
 * C'est ce que le backend renvoie sur les lectures (findAll avec include).
 * Les colonnes et le DataTable utilisent ce type.
 */
export type Tarif = allTarifSingleType

export type CreateTarif = z.infer<typeof createTarifSchema>
export type UpdateTarif = z.infer<typeof updateTarifSchema>

// ─── Types de réponse API ─────────────────────────────────────────────────────

=======
export type Tarif = z.infer<typeof tarifSchema>
export type CreateTarif = z.infer<typeof createTarifSchema>
export type UpdateTarif = z.infer<typeof updateTarifSchema>

// Types pour les réponses API
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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

<<<<<<< HEAD
export type allTarifResponseTypes = {
  success: boolean
  message: string
  data: allTarifSingleType[]
}

/** Réponse brute sur CREATE/UPDATE (pas de jointures, juste les IDs) */
=======
// Types pour la réponse brute du backend (avant conversion)
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export interface BackendTarifResponse {
  success: boolean
  message: string
  data: {
    id_tarif: number
    id_classe: number
<<<<<<< HEAD
=======
    id_annee: string
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    id_type_frais: number
    montant_fixe: number
  }
}

export type TarifFieldErrors = {
  [K in keyof CreateTarif]?: string[]
<<<<<<< HEAD
}
=======
}
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
