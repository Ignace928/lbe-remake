import { 
  Paiement, 
  CreatePaiement, 
  UpdatePaiement,
  PaiementResponse,
  PaiementSingleResponse,
  BackendPaiementResponse 
} from './paiement_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Paiement => {
  return {
    id_paiement: typeof backendData.id_paiement === 'string' 
      ? parseInt(backendData.id_paiement, 10) 
      : backendData.id_paiement,
    ref: backendData.ref,
    id_inscription: typeof backendData.id_inscription === 'string' 
      ? parseInt(backendData.id_inscription, 10) 
      : backendData.id_inscription,
    id_type_frais: typeof backendData.id_type_frais === 'string' 
      ? parseInt(backendData.id_type_frais, 10) 
      : backendData.id_type_frais,
    montant_paye: typeof backendData.montant_paye === 'string' 
      ? parseFloat(backendData.montant_paye) 
      : backendData.montant_paye,
    date_paiement: new Date(backendData.date_paiement),
  }
}

export const api = {
  // CREATE
  create: async (data: CreatePaiement): Promise<{data: Paiement, message: string}> => {
    const response = await window.ipc.paiement.create(data) as BackendPaiementResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL
  getAll: async (): Promise<Paiement[]> => {
    const response = await window.ipc.paiement.getAll() as PaiementResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
  },

  // READ BY ID
  getById: async (id: number): Promise<Paiement> => {
    const response = await window.ipc.paiement.getById(id) as PaiementSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdatePaiement): Promise<{data: Paiement, message: string}> => {
    const response = await window.ipc.paiement.update(id, data) as BackendPaiementResponse
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
    const response = await window.ipc.paiement.delete(id) as PaiementSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}
