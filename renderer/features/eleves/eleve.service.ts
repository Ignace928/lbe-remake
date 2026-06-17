import { 
  Eleve, 
  CreateEleve, 
  UpdateEleve,
  EleveResponse,
  EleveSingleResponse,
  BackendEleveResponse 
} from './eleve_types'

// Types pour les paramètres de pagination
export interface EleveGetAllParams {
  cursor?: number
  limit?: number
}

// Types pour la réponse de pagination
export interface EleveGetAllResult {
  rows: Eleve[]
  pagination: {
    cursor: number
    hasMore: boolean
    totalCount: number
    currentBatchSize: number
    limit: number
  }
}

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Eleve => {
  return {
    id_eleve: typeof backendData.id_eleve === 'string' 
      ? parseInt(backendData.id_eleve, 10) 
      : backendData.id_eleve,
    matricule: backendData.matricule || '',
    nom_eleve: backendData.nom_eleve,
    post_nom_eleve: backendData.post_nom_eleve || '',
    sexe: backendData.sexe,
    date_naissance: backendData.date_naissance,
    lieu_naissance: backendData.lieu_naissance || '',
    nationalite: backendData.nationalite || '',
    adresse: backendData.adresse || '',
    telephone: backendData.telephone || '',
    email: backendData.email || '',
    nom_pere: backendData.nom_pere || '',
    nom_mere: backendData.nom_mere || '',
    profession_pere: backendData.profession_pere || '',
    profession_mere: backendData.profession_mere || '',
    etat: backendData.etat,
    maladie: backendData.maladie || '',
    taille: backendData.taille || 0,
    created_at: new Date(backendData.created_at),
  }
}

export const api = {
  // CREATE
  create: async (data: CreateEleve): Promise<{data: Eleve, message: string}> => {
    // console.log('Service - Données envoyées:', data)
    const response = await window.ipc.eleve.create(data) as BackendEleveResponse
    
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL (avec pagination optimisée)
  getAll: async (params?: EleveGetAllParams): Promise<EleveGetAllResult> => {
    const response = await window.ipc.eleve.getAll(params) as EleveResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      rows: response.data.rows.map(a => convertBackendToFrontend(a)),
      pagination: response.data.pagination
    }
  },

  // READ BY ID
  getById: async (id: number): Promise<Eleve> => {
    const response = await window.ipc.eleve.getById(id) as EleveSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdateEleve): Promise<{data: Eleve, message: string}> => {
    // console.log('Service - Mise à jour élève:', { id, data })
    const response = await window.ipc.eleve.update(id, data) as BackendEleveResponse
    // console.log('Service - Réponse mise à jour:', response)
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
    // console.log('Service - Suppression élève:', id)
    const response = await window.ipc.eleve.delete(id) as EleveSingleResponse
    // console.log('Service - Réponse suppression:', response)
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}