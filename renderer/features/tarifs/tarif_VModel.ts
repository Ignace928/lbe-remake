import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './tarif.service'
import { UpdateTarif } from './tarif_types'

// API Calls


// Hooks
export const useTarifQuery = () => {
  return useQuery({
    queryKey: ['tarifs'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useTarifByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['tarifs', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateTarifMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newTarif) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tarifs'] })
      
      // Snapshot the previous value
      const previousTarifs = queryClient.getQueryData(['tarifs'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['tarifs'], (old: any) => 
        old ? [...old, newTarif] : [newTarif]
      )
      
      return { previousTarifs }
    },
    onError: (err, newTarif, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTarifs) {
        queryClient.setQueryData(['tarifs'], context.previousTarifs)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tarifs'] })
    },
  })
}

export const useUpdateTarifMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTarif }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tarifs'] })
      
      // Snapshot the previous value
      const previousTarifs = queryClient.getQueryData(['tarifs'])
      
      // Optimistically update the item
      queryClient.setQueryData(['tarifs'], (old: any) => 
        old?.map((tarif: any) => 
          tarif.id_tarif === id ? { ...tarif, ...data } : tarif
        )
      )
      
      return { previousTarifs }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTarifs) {
        queryClient.setQueryData(['tarifs'], context.previousTarifs)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tarifs'] })
    },
  })
}

export const useDeleteTarifMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tarifs'] })
      
      // Snapshot the previous value
      const previousTarifs = queryClient.getQueryData(['tarifs'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['tarifs'], (old: any) => 
        old?.filter((tarif: any) => tarif.id_tarif !== id)
      )
      
      return { previousTarifs }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTarifs) {
        queryClient.setQueryData(['tarifs'], context.previousTarifs)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tarifs'] })
    },
  })
}

// ViewModel combiné
export const useTarifVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useTarifQuery()
  const createMutation = useCreateTarifMutation()
  const updateMutation = useUpdateTarifMutation()
  const deleteMutation = useDeleteTarifMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createTarif: createMutation,
    updateTarif: updateMutation,
    deleteTarif: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifs'] })
    }
  }
}
