import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './typeFrais.service'
import { UpdateTypeFrais } from './typeFrais_types'

// API Calls
// Hooks
export const useTypeFraisQuery = () => {
  return useQuery({
    queryKey: ['typeFrais'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useTypeFraisByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['typeFrais', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateTypeFraisMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newTypeFrais) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['typeFrais'] })
      
      // Snapshot the previous value
      const previousTypeFrais = queryClient.getQueryData(['typeFrais'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['typeFrais'], (old: any) => 
        old ? [...old, newTypeFrais] : [newTypeFrais]
      )
      
      return { previousTypeFrais }
    },
    onError: (err, newTypeFrais, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTypeFrais) {
        queryClient.setQueryData(['typeFrais'], context.previousTypeFrais)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['typeFrais'] })
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
    },
  })
}

export const useUpdateTypeFraisMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTypeFrais }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['typeFrais'] })
      
      // Snapshot the previous value
      const previousTypeFrais = queryClient.getQueryData(['typeFrais'])
      
      // Optimistically update the item
      queryClient.setQueryData(['typeFrais'], (old: any) => 
        old?.map((typeFrais: any) => 
          typeFrais.id_type_frais === id ? { ...typeFrais, ...data } : typeFrais
        )
      )
      
      return { previousTypeFrais }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTypeFrais) {
        queryClient.setQueryData(['typeFrais'], context.previousTypeFrais)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['typeFrais'] })
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe']})
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
    },
  })
}

export const useDeleteTypeFraisMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['typeFrais'] })
      
      // Snapshot the previous value
      const previousTypeFrais = queryClient.getQueryData(['typeFrais'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['typeFrais'], (old: any) => 
        old?.filter((typeFrais: any) => typeFrais.id_type_frais !== id)
      )
      
      return { previousTypeFrais }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTypeFrais) {
        queryClient.setQueryData(['typeFrais'], context.previousTypeFrais)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['typeFrais'] })
    },
  })
}

// ViewModel combiné
export const useTypeFraisVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useTypeFraisQuery()
  const createMutation = useCreateTypeFraisMutation()
  const updateMutation = useUpdateTypeFraisMutation()
  const deleteMutation = useDeleteTypeFraisMutation()

  return {
    // Query
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createTypeFrais: createMutation,
    updateTypeFrais: updateMutation,
    deleteTypeFrais: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['typeFrais'] })
    }
  }
}
