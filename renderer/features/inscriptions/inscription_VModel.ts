import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, inscriptionByIdParams } from './inscription.service'
import { getAllThisYearParams, UpdateInscription } from './inscription_types'

// API Calls


// Hooks
export const useInscriptionQuery = (p?:getAllThisYearParams) => {
  return useQuery({
    queryKey: ['inscriptions', p?.cursor||0, p?.id_anne||20, p?.id_anne||""],
    queryFn: ()=>api.getAllThisYear(p),
    enabled:!!p,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useInscriptionByIdQuery = (params?:inscriptionByIdParams) => {
  return useQuery({
    queryKey: ['inscriptions', params?.id_eleve||0, params?.id_anne||""],
    queryFn: () => api.getById(params),
    enabled: !!params,
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
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
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
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
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
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
    },
  })
}

// ViewModel combiné
export const useInscriptionVm = (p?:getAllThisYearParams) => {
  const queryClient = useQueryClient()
  
  const dataQuery = useInscriptionQuery(p || {})
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
