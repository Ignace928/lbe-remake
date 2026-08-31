import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './paiement.service'
import { UpdatePaiement } from './paiement_types'

// API Calls


// Hooks
export const usePaiementQuery = () => {
  return useQuery({
    queryKey: ['paiements'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const usePaiementByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['paiements', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreatePaiementMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newPaiement) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['paiements'] })
      
      // Snapshot the previous value
      const previousPaiements = queryClient.getQueryData(['paiements'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['paiements'], (old: any) => 
        old ? [...old, newPaiement] : [newPaiement]
      )
      
      return { previousPaiements }
    },
    onError: (err, newPaiement, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPaiements) {
        queryClient.setQueryData(['paiements'], context.previousPaiements)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['paiements'] })
    },
  })
}

export const useUpdatePaiementMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaiement }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['paiements'] })
      
      // Snapshot the previous value
      const previousPaiements = queryClient.getQueryData(['paiements'])
      
      // Optimistically update the item
      queryClient.setQueryData(['paiements'], (old: any) => 
        old?.map((paiement: any) => 
          paiement.id_paiement === id ? { ...paiement, ...data } : paiement
        )
      )
      
      return { previousPaiements }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPaiements) {
        queryClient.setQueryData(['paiements'], context.previousPaiements)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['paiements'] })
    },
  })
}

export const useDeletePaiementMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['paiements'] })
      
      // Snapshot the previous value
      const previousPaiements = queryClient.getQueryData(['paiements'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['paiements'], (old: any) => 
        old?.filter((paiement: any) => paiement.id_paiement !== id)
      )
      
      return { previousPaiements }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPaiements) {
        queryClient.setQueryData(['paiements'], context.previousPaiements)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['paiements'] })
    },
  })
}

// ViewModel combiné
export const usePaiementVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = usePaiementQuery()
  const createMutation = useCreatePaiementMutation()
  const updateMutation = useUpdatePaiementMutation()
  const deleteMutation = useDeletePaiementMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createPaiement: createMutation,
    updatePaiement: updateMutation,
    deletePaiement: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['paiements'] })
    }
  }
}
