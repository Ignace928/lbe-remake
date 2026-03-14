import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
    matricule: backendData.matricule,
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

// API Calls
const api = {
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
    return response.data.map(convertBackendToFrontend)
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

// Hooks
export const useEleveQuery = () => {
  return useQuery({
    queryKey: ['eleves'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useEleveByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['eleves', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateEleveMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    },
  })
}

export const useUpdateEleveMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEleve }) => 
      api.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    },
  })
}

export const useDeleteEleveMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    },
  })
}

// ViewModel combiné
export const useEleveVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useEleveQuery()
  const createMutation = useCreateEleveMutation()
  const updateMutation = useUpdateEleveMutation()
  const deleteMutation = useDeleteEleveMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createEleve: createMutation,
    updateEleve: updateMutation,
    deleteEleve: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    }
  }
}
