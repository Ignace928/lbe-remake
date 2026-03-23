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
    onMutate: async (newEleve) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['eleves'] })
      
      // Snapshot the previous value
      const previousEleves = queryClient.getQueryData(['eleves'])
      
      // Optimistically update to the new value (newEleve contient déjà l'objet Eleve)
      queryClient.setQueryData(['eleves'], (old: any) => 
        old ? [...old, newEleve] : [newEleve]
      )
      
      return { previousEleves }
    },
    onError: (err, newEleve, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEleves) {
        queryClient.setQueryData(['eleves'], context.previousEleves)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    },
  })
}

export const useUpdateEleveMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEleve }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['eleves'] })
      
      // Snapshot the previous value
      const previousEleves = queryClient.getQueryData(['eleves'])
      
      // Optimistically update the item
      queryClient.setQueryData(['eleves'], (old: any) => 
        old?.map((eleve: any) => 
          eleve.id_eleve === id ? { ...eleve, ...data } : eleve
        )
      )
      
      return { previousEleves }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEleves) {
        queryClient.setQueryData(['eleves'], context.previousEleves)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
    },
  })
}

export const useDeleteEleveMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['eleves'] })
      
      // Snapshot the previous value
      const previousEleves = queryClient.getQueryData(['eleves'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['eleves'], (old: any) => 
        old?.filter((eleve: any) => eleve.id_eleve !== id)
      )
      
      return { previousEleves }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEleves) {
        queryClient.setQueryData(['eleves'], context.previousEleves)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
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
