import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './classe.service'
import { UpdateClasse } from './classe_types'

// API Calls


// Hooks
export const useClasseQuery = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: api.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useClasseByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateClasseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newClasse) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['classes'] })
      
      // Snapshot the previous value
      const previousClasses = queryClient.getQueryData(['classes'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['classes'], (old: any) => 
        old ? [...old, newClasse] : [newClasse]
      )
      
      return { previousClasses }
    },
    onError: (err, newClasse, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousClasses) {
        queryClient.setQueryData(['classes'], context.previousClasses)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export const useUpdateClasseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClasse }) => 
      api.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['classes'] })
      
      // Snapshot the previous value
      const previousClasses = queryClient.getQueryData(['classes'])
      
      // Optimistically update the item
      queryClient.setQueryData(['classes'], (old: any) => 
        old?.map((classe: any) => 
          classe.id_classe === id ? { ...classe, ...data } : classe
        )
      )
      
      return { previousClasses }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousClasses) {
        queryClient.setQueryData(['classes'], context.previousClasses)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export const useDeleteClasseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['classes'] })
      
      // Snapshot the previous value
      const previousClasses = queryClient.getQueryData(['classes'])
      
      // Optimistically remove the item
      queryClient.setQueryData(['classes'], (old: any) => 
        old?.filter((classe: any) => classe.id_classe !== id)
      )
      
      return { previousClasses }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousClasses) {
        queryClient.setQueryData(['classes'], context.previousClasses)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

// ViewModel combiné
export const useClasseVm = () => {
  const queryClient = useQueryClient()
  
  const dataQuery = useClasseQuery()
  const createMutation = useCreateClasseMutation()
  const updateMutation = useUpdateClasseMutation()
  const deleteMutation = useDeleteClasseMutation()

  
  return {
    // Query - les données sont déjà un tableau direct
    data: dataQuery.data || [],
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    refetch: dataQuery.refetch,
    
    // Mutations
    createClasse: createMutation,
    updateClasse: updateMutation,
    deleteClasse: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    }
  }
}
