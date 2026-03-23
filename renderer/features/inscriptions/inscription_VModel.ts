import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './inscription.service'
import { UpdateInscription } from './inscription_types'

// API Calls


// Hooks
export const useInscriptionQuery = () => {
  return useQuery({
    queryKey: ['inscriptions'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useInscriptionByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['inscriptions', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateInscriptionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newInscription) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['inscriptions'] })
      
      // Snapshot the previous value
      const previousInscriptions = queryClient.getQueryData(['inscriptions'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['inscriptions'], (old: any) => 
        old ? [...old, newInscription] : [newInscription]
      )
      
      return { previousInscriptions }
    },
    onError: (err, newInscription, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousInscriptions) {
        queryClient.setQueryData(['inscriptions'], context.previousInscriptions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
    },
  })
}

export const useUpdateInscriptionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInscription }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['inscriptions'] })
      
      // Snapshot the previous value
      const previousInscriptions = queryClient.getQueryData(['inscriptions'])
      
      // Optimistically update the item
      queryClient.setQueryData(['inscriptions'], (old: any) => 
        old?.map((inscription: any) => 
          inscription.id_inscription === id ? { ...inscription, ...data } : inscription
        )
      )
      
      return { previousInscriptions }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousInscriptions) {
        queryClient.setQueryData(['inscriptions'], context.previousInscriptions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
    },
  })
}

export const useDeleteInscriptionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['inscriptions'] })
      
      // Snapshot the previous value
      const previousInscriptions = queryClient.getQueryData(['inscriptions'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['inscriptions'], (old: any) => 
        old?.filter((inscription: any) => inscription.id_inscription !== id)
      )
      
      return { previousInscriptions }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousInscriptions) {
        queryClient.setQueryData(['inscriptions'], context.previousInscriptions)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
    },
  })
}

// ViewModel combiné
export const useInscriptionVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useInscriptionQuery()
  const createMutation = useCreateInscriptionMutation()
  const updateMutation = useUpdateInscriptionMutation()
  const deleteMutation = useDeleteInscriptionMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createInscription: createMutation,
    updateInscription: updateMutation,
    deleteInscription: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
    }
  }
}
