import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, EleveGetAllParams } from './eleve.service'
import { UpdateEleve,} from './eleve_types'

// API Calls

// const id = useAnneeStore().anne_Active.id_anne
// Hooks
export const useEleveQuery = (p?: EleveGetAllParams) => {
  return useQuery({
    queryKey: ['eleves', p?.cursor || 0, p?.limit || 20],
    queryFn: ()=>api.getAll(p),
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
      
      // Optimistically update to the new value
      queryClient.setQueryData(['eleves'], (old: any) => {
        if (!old) return { rows: [newEleve], pagination: { cursor: 1, hasMore: false, totalCount: 1, currentBatchSize: 1, limit: 20 } }
        if (old.rows && Array.isArray(old.rows)) {
          return { ...old, rows: [...old.rows, newEleve] }
        }
        return old
      })
      
      return { previousEleves }
    },
    onError: (err, newEleve, context) => {
      console.error('VModel - Erreur dans la mutation:', err)
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEleves) {
        queryClient.setQueryData(['eleves'], context.previousEleves)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
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
      queryClient.setQueryData(['eleves'], (old: any) => {
        if (!old) return old
        if (old.rows && Array.isArray(old.rows)) {
          return {
            ...old,
            rows: old.rows.map((eleve: any) => 
              eleve.id_eleve === id ? { ...eleve, ...data } : eleve
            )
          }
        }
        return old
      })
      
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
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
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
      queryClient.setQueryData(['eleves'], (old: any) => {
        if (!old) return old
        if (old.rows && Array.isArray(old.rows)) {
          return {
            ...old,
            rows: old.rows.filter((eleve: any) => eleve.id_eleve !== id)
          }
        }
        return old
      })
      
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
export const useEleveVm = (p?: EleveGetAllParams) => {
  const queryClient = useQueryClient()
  
  const dataQuery = useEleveQuery(p || {})
  const createMutation = useCreateEleveMutation()
  const updateMutation = useUpdateEleveMutation()
  const deleteMutation = useDeleteEleveMutation()

  return {
    // Query
    data: dataQuery.data?.rows || [],
    pagination: dataQuery.data?.pagination,
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
