import { 
  Inscription, 
  CreateInscription, 
  UpdateInscription,
  InscriptionResponse,
  InscriptionSingleResponse,
  BackendInscriptionResponse 
} from './inscription_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Inscription => {
  return {
    id_inscription: typeof backendData.id_inscription === 'string' 
      ? parseInt(backendData.id_inscription, 10) 
      : backendData.id_inscription,
    id_classe: typeof backendData.id_classe === 'string' 
      ? parseInt(backendData.id_classe, 10) 
      : backendData.id_classe,
    id_eleve: typeof backendData.id_eleve === 'string' 
      ? parseInt(backendData.id_eleve, 10) 
      : backendData.id_eleve,
    id_annee: backendData.id_annee,
    passant: backendData.passant,
  }
}

export const api = {
  // CREATE
  create: async (data: CreateInscription): Promise<{data: Inscription, message: string}> => {
    const response = await window.ipc.inscription.create(data) as BackendInscriptionResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL
  getAll: async (): Promise<Inscription[]> => {
    const response = await window.ipc.inscription.getAll() as InscriptionResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
  },

  // READ BY ID
  getById: async (id: number): Promise<Inscription> => {
    const response = await window.ipc.inscription.getById(id) as InscriptionSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdateInscription): Promise<{data: Inscription, message: string}> => {
    const response = await window.ipc.inscription.update(id, data) as BackendInscriptionResponse
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
    const response = await window.ipc.inscription.delete(id) as InscriptionSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}
