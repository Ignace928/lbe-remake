import { 
  TypeFrais, 
  CreateTypeFrais, 
  UpdateTypeFrais,
  TypeFraisResponse,
  TypeFraisSingleResponse,
  BackendTypeFraisResponse 
} from './typeFrais_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): TypeFrais => {
  return {
    id_type_frais: typeof backendData.id_type_frais === 'string' 
      ? parseInt(backendData.id_type_frais, 10) 
      : backendData.id_type_frais,
    libelle: backendData.libelle,
    detail: backendData.detail || '',
  }
}

export const api = {
  // CREATE
  create: async (data: CreateTypeFrais): Promise<{data: TypeFrais, message: string}> => {
    const response = await window.ipc.typeFrais.create(data) as BackendTypeFraisResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL
  getAll: async (): Promise<TypeFrais[]> => {
    const response = await window.ipc.typeFrais.getAll() as TypeFraisResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
  },

  // READ BY ID
  getById: async (id: number): Promise<TypeFrais> => {
    const response = await window.ipc.typeFrais.getById(id) as TypeFraisSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdateTypeFrais): Promise<{data: TypeFrais, message: string}> => {
    const response = await window.ipc.typeFrais.update(id, data) as BackendTypeFraisResponse
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
    const response = await window.ipc.typeFrais.delete(id) as TypeFraisSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}
