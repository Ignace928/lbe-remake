import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  AnneeScolaire, 
  CreateAnneeScolaire, 
  UpdateAnneeScolaire,
  AnneeScolaireResponse,
  AnneeScolaireSingleResponse,
  BackendAnneeScolaireResponse 
} from './anneeScolaire_types'

// Fonction pour convertir les données du backend vers le frontend
const convertBackendToFrontend = (backendData: any): AnneeScolaire => {
  return {
    id_annee: backendData.id_annee, // UUID reste en string
    libelle: backendData.libelle,
  }
}

// API Calls
const api = {
  // CREATE
  create: async (data: CreateAnneeScolaire): Promise<AnneeScolaire> => {
    const response = await window.ipc.anneeScolaire.create(data) as BackendAnneeScolaireResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // READ ALL
  getAll: async (): Promise<AnneeScolaire[]> => {
    const response = await window.ipc.anneeScolaire.getAll() as AnneeScolaireResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data.map(convertBackendToFrontend)
  },

  // READ BY ID
  getById: async (id: string): Promise<AnneeScolaire> => {
    const response = await window.ipc.anneeScolaire.getById(id) as AnneeScolaireSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // UPDATE
  update: async (id: string, data: UpdateAnneeScolaire): Promise<AnneeScolaire> => {
    const response = await window.ipc.anneeScolaire.update(id, data) as BackendAnneeScolaireResponse
    if (!response.success) {
      throw new Error(response.message)
    }
    return convertBackendToFrontend(response.data)
  },

  // DELETE
  delete: async (id: string): Promise<void> => {
    const response = await window.ipc.anneeScolaire.delete(id) as AnneeScolaireSingleResponse
    if (!response.success) {
      throw new Error(response.message)
    }
  }
}

// Hooks
export const useAnneeScolaireQuery = () => {
  return useQuery({
    queryKey: ['anneesScolaires'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useAnneeScolaireByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['anneesScolaires', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateAnneeScolaireMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anneesScolaires'] })
    },
  })
}

export const useUpdateAnneeScolaireMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnneeScolaire }) => 
      api.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anneesScolaires'] })
    },
  })
}

export const useDeleteAnneeScolaireMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete, // id: string
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anneesScolaires'] })
    },
  })
}

// ViewModel combiné
export const useAnneeScolaireVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useAnneeScolaireQuery()
  const createMutation = useCreateAnneeScolaireMutation()
  const updateMutation = useUpdateAnneeScolaireMutation()
  const deleteMutation = useDeleteAnneeScolaireMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createAnneeScolaire: createMutation,
    updateAnneeScolaire: updateMutation,
    deleteAnneeScolaire: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['anneesScolaires'] })
    }
  }
}
