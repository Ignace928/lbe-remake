<<<<<<< HEAD
import {
  CreateTarif,
  UpdateTarif,
  BackendTarifResponse,
  allTarifResponseTypes,
  allTarifSingleType,
  TarifSingleResponse,
} from './tarif_types'

// ─── Convertisseur backend → frontend ────────────────────────────────────────
//
// Le backend SQLite peut retourner des nombres sous forme de string (DECIMAL).
// Cette fonction normalise les types avant utilisation dans le frontend.
//
const convertBackendToFrontend = (raw: any): allTarifSingleType => ({
  id_tarif: Number(raw.id_tarif),
  id_classe: Number(raw.id_classe),
  id_type_frais: Number(raw.id_type_frais),   // ✅ était mappé sur montant_fixe par erreur
  montant_fixe: parseFloat(raw.montant_fixe),
  classe: {
    id_classe: Number(raw.classe?.id_classe),
    nom_classe: raw.classe?.nom_classe ?? '',
    niveau: raw.classe?.niveau ?? '',
  },
  typeFrais: {
    id_type_frais: Number(raw.typeFrais?.id_type_frais),
    libelle: raw.typeFrais?.libelle ?? '',
    detail: raw.typeFrais?.detail ?? '',
  },
})

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {

  // CREATE — le backend renvoie uniquement les IDs (pas de jointures),
  // on retourne donc seulement le message de confirmation.
  // L'appelant (VModel) doit appeler getAll() pour rafraîchir la liste.
  create: async (data: CreateTarif): Promise<{ message: string }> => {
    const response = await window.ipc.tarif.create(data) as BackendTarifResponse
    if (!response.success) throw new Error(response.message)
    return { message: response.message }
  },

  // READ ALL — normalise chaque ligne via convertBackendToFrontend
  getAll: async (): Promise<allTarifSingleType[]> => {
    const response = await window.ipc.tarif.getAll() as allTarifResponseTypes
    if (!response.success) throw new Error(response.message)
    return response.data.map(convertBackendToFrontend)
  },

  // READ BY ID
  getById: async (id: number): Promise<allTarifSingleType> => {
    const response = await window.ipc.tarif.getById(id) as TarifSingleResponse
    if (!response.success) throw new Error(response.message)
    return convertBackendToFrontend(response.data)
  },

  // UPDATE — même remarque que CREATE : pas de jointures en retour
  update: async (id: number, data: UpdateTarif): Promise<{ message: string }> => {
    const response = await window.ipc.tarif.update(id, data) as BackendTarifResponse
    if (!response.success) throw new Error(response.message)
    return { message: response.message }
  },

  // DELETE
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await window.ipc.tarif.delete(id) as TarifSingleResponse
    if (!response.success) throw new Error(response.message)
    return { message: response.message }
  },
}
=======
import { 
  Tarif, 
  CreateTarif, 
  UpdateTarif,
  TarifResponse,
  TarifSingleResponse,
  BackendTarifResponse 
} from './tarif_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Tarif => {
  return {
    id_tarif: typeof backendData.id_tarif === 'string' 
      ? parseInt(backendData.id_tarif, 10) 
      : backendData.id_tarif,
    id_classe: typeof backendData.id_classe === 'string' 
      ? parseInt(backendData.id_classe, 10) 
      : backendData.id_classe,
    id_annee: backendData.id_annee,
    id_type_frais: typeof backendData.id_type_frais === 'string' 
      ? parseInt(backendData.id_type_frais, 10) 
      : backendData.id_type_frais,
    montant_fixe: typeof backendData.montant_fixe === 'string' 
      ? parseFloat(backendData.montant_fixe) 
      : backendData.montant_fixe,
  }
}

export const api = {
  // CREATE
  create: async (data: CreateTarif): Promise<{data: Tarif, message: string}> => {
    const response = await window.ipc.tarif.create(data) as BackendTarifResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL
  getAll: async (): Promise<Tarif[]> => {
    const response = await window.ipc.tarif.getAll() as TarifResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
  },

  // READ BY ID
  getById: async (id: number): Promise<Tarif> => {
    const response = await window.ipc.tarif.getById(id) as TarifSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdateTarif): Promise<{data: Tarif, message: string}> => {
    const response = await window.ipc.tarif.update(id, data) as BackendTarifResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // DELETE
  delete: async (id: number): Promise<{message: string}> => {
    const response = await window.ipc.tarif.delete(id) as TarifSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
