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
<<<<<<< HEAD
  // Gérer le cas où les données sont dans dataValues (Sequelize)
  const data = backendData.dataValues || backendData  
  const result = {
    id_type_frais: typeof data.id_type_frais === 'string' 
      ? parseInt(data.id_type_frais, 10) 
      : data.id_type_frais,
    libelle: data.libelle,
    detail: data.detail || '',
    freq: data.freq
  }
  return result
=======
  return {
    id_type_frais: typeof backendData.id_type_frais === 'string' 
      ? parseInt(backendData.id_type_frais, 10) 
      : backendData.id_type_frais,
    libelle: backendData.libelle,
    detail: backendData.detail || '',
  }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
