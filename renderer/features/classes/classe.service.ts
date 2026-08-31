import { 
  Classe, 
  CreateClasse, 
  UpdateClasse,
  ClasseResponse,
  ClasseSingleResponse,
<<<<<<< HEAD
  BackendClasseResponse, 
  classesWithMatricules,
  ClasseWithMatriculeResponse
=======
  BackendClasseResponse 
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
} from './classe_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): Classe => {
  return {
    id_classe: typeof backendData.id_classe === 'string' 
      ? parseInt(backendData.id_classe, 10) 
      : backendData.id_classe,
    nom_classe: backendData.nom_classe,
    niveau: backendData.niveau,
    delegue_1: backendData.delegue_1 || null,
    delegue_2: backendData.delegue_2 || null,
    meilleur_eleve: backendData.meilleur_eleve || null,
    titulaire: backendData.titulaire || null,
  }
}

export const api = {
  // CREATE
  create: async (data: CreateClasse): Promise<{data: Classe, message: string}> => {
    const response = await window.ipc.classe.create(data) as BackendClasseResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      data: convertBackendToFrontend(response.data),
      message: response.message
    }
  },

  // READ ALL
<<<<<<< HEAD
  getAll: async (): Promise<classesWithMatricules[]> => {
    const response = await window.ipc.classe.getAll() as ClasseWithMatriculeResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(backendData => {return{
      id_classe: typeof backendData.id_classe === 'string' 
      ? parseInt(backendData.id_classe, 10) 
      : backendData.id_classe,
      nom_classe: backendData.nom_classe,
      niveau: backendData.niveau,
      delegue_1: backendData.delegue_1 || null,
      delegue_2: backendData.delegue_2 || null,
      meilleur_eleve: backendData.meilleur_eleve || null,
      titulaire: backendData.titulaire || null,
      delegue_1_matricule: backendData.delegue_1_matricule || null,
      delegue_2_matricule: backendData.delegue_2_matricule || null,
      meilleur_eleve_matricule: backendData.meilleur_eleve_matricule || null
    }})
=======
  getAll: async (): Promise<Classe[]> => {
    const response = await window.ipc.classe.getAll() as ClasseResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(a => convertBackendToFrontend(a))
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  },

  // READ BY ID
  getById: async (id: number): Promise<Classe> => {
    const response = await window.ipc.classe.getById(id) as ClasseSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: number, data: UpdateClasse): Promise<{data: Classe, message: string}> => {
    const response = await window.ipc.classe.update(id, data) as BackendClasseResponse
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
    const response = await window.ipc.classe.delete(id) as ClasseSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      message: response.message
    }
  }
}
