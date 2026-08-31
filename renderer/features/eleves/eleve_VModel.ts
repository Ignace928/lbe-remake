import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
<<<<<<< HEAD
import { api, EleveGetAllParams } from './eleve.service'
import { UpdateEleve,} from './eleve_types'
import { useAnneeStore } from '@/store/anneStore'

// API Calls

// const id = useAnneeStore().anne_Active.id_anne
// Hooks
export const useEleveQuery = (p?: EleveGetAllParams) => {
  return useQuery({
    queryKey: ['eleves', p?.cursor || 0, p?.limit || 20],
    queryFn: ()=>api.getAll(p),
=======
import { api } from './eleve.service'
import { UpdateEleve,} from './eleve_types'

// API Calls


// Hooks
export const useEleveQuery = () => {
  return useQuery({
    queryKey: ['eleves'],
    queryFn: api.getAll,
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
      
<<<<<<< HEAD
      // Optimistically update to the new value
      queryClient.setQueryData(['eleves'], (old: any) => {
        if (!old) return { rows: [newEleve], pagination: { cursor: 1, hasMore: false, totalCount: 1, currentBatchSize: 1, limit: 20 } }
        if (old.rows && Array.isArray(old.rows)) {
          return { ...old, rows: [...old.rows, newEleve] }
        }
        return old
      })
=======
      // Optimistically update to the new value (newEleve contient déjà l'objet Eleve)
      queryClient.setQueryData(['eleves'], (old: any) => 
        old ? [...old, newEleve] : [newEleve]
      )
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      
      return { previousEleves }
    },
    onError: (err, newEleve, context) => {
<<<<<<< HEAD
      console.error('VModel - Erreur dans la mutation:', err)
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEleves) {
        queryClient.setQueryData(['eleves'], context.previousEleves)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['eleves'] })
<<<<<<< HEAD
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
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
=======
      queryClient.setQueryData(['eleves'], (old: any) => 
        old?.map((eleve: any) => 
          eleve.id_eleve === id ? { ...eleve, ...data } : eleve
        )
      )
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      
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
<<<<<<< HEAD
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
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
=======
      queryClient.setQueryData(['eleves'], (old: any) => 
        old?.filter((eleve: any) => eleve.id_eleve !== id)
      )
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      
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
<<<<<<< HEAD
export const useEleveVm = (p?: EleveGetAllParams) => {
  const queryClient = useQueryClient()
  
  const dataQuery = useEleveQuery(p || {})
=======
export const useEleveVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useEleveQuery()
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  const createMutation = useCreateEleveMutation()
  const updateMutation = useUpdateEleveMutation()
  const deleteMutation = useDeleteEleveMutation()

  return {
    // Query
<<<<<<< HEAD
    data: dataQuery.data?.rows || [],
    pagination: dataQuery.data?.pagination,
=======
    data: dataQuery.data || [],
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
