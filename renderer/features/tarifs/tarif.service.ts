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
