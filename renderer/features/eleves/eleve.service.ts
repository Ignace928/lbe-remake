import { 
  Eleve, 
  CreateEleve, 
  UpdateEleve,
  EleveResponse,
  EleveSingleResponse,
  BackendEleveResponse 
} from './eleve_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Eleve => {
  return {
    id_eleve: typeof backendData.id_eleve === 'string' 
      ? parseInt(backendData.id_eleve, 10) 
      : backendData.id_eleve,
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
  create: async (data: CreateEleve): Promise<Eleve> => {
    const response = await window.ipc.eleve.create(data) as BackendEleveResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // READ ALL
  getAll: async (): Promise<Eleve[]> => {
    const response = await window.ipc.eleve.getAll() as EleveResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
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
  update: async (id: number, data: UpdateEleve): Promise<Eleve> => {
    const response = await window.ipc.eleve.update(id, data) as BackendEleveResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // DELETE
  delete: async (id: number): Promise<void> => {
    const response = await window.ipc.eleve.delete(id) as EleveSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
  }
}