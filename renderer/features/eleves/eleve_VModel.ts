import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './eleve.service'
import { UpdateEleve,} from './eleve_types'

// API Calls


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
