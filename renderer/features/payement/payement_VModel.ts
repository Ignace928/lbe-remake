import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./payement.service"

type PaiementUpdateType = {
    id_type_frais?: number;
    montant_paye?: number;
}



export const usePayementById = (params:{id_inscription:number}) => {
  return useQuery({
    queryKey: ['payements', params.id_inscription],
    queryFn: ()=>api.getAllByInscription(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
export const useCreatePayement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.create,
    onMutate: async (newPaye) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['payements'] })
      
      // Snapshot the previous value
      const prevPayement = queryClient.getQueryData(['payements'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['payements'], (old: any) => 
        old ? [...old, newPaye] : [newPaye]
      )
      
      return { prevPayement }
    },
    onError: (err, newPaye, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.prevPayement) {
        queryClient.setQueryData(['payements'], context.prevPayement)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['payements'] })
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
    },
  })
}

export const useUpdatePayement = ()=>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:({id_paiement, paiementData}:{id_paiement: number, paiementData: PaiementUpdateType})=>
      api.update(id_paiement,paiementData),
    onMutate: async function(id_paiement, paiementData){
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['payements'] })
      
      // Snapshot the previous value
      const prevPayement = queryClient.getQueryData(['payements'])
      
      // Optimistically update to the items
      queryClient.setQueryData(['payements'], (old: any) => 
        old?.map((paye: any) => 
          paye.id_paiement === id_paiement ? { ...paye, ...paiementData } : paye
        )
      )
      
      return { prevPayement }
    },
    onError: (err, paye, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.prevPayement) {
        queryClient.setQueryData(['payements'], context.prevPayement)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['payements'] })
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
    },
  })
}


export const useDeletePayement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.delete,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['payements'] })
      
      // Snapshot the previous value
      const prevPayement = queryClient.getQueryData(['payements'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['payements'], (old: any) => 
        old?.filter((data:any)=>data.id_paiement !== id)
      )
      
      return { prevPayement }
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.prevPayement) {
        queryClient.setQueryData(['payements'], context.prevPayement)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['payements'] })
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] })
      queryClient.invalidateQueries({ queryKey: ["kpiGlobal"] })
      queryClient.invalidateQueries({ queryKey: ['payement-par-classe'] })
      queryClient.invalidateQueries({ queryKey: ['paiement-par-frais'] })
      queryClient.invalidateQueries({ queryKey: ['effectifTotale'] })
    },
  })
}





export const usePayementVM = (params?:{id_inscription:number})=>{
  const queryClient = useQueryClient()
  
  const dataQueryById = usePayementById(params||{id_inscription:0})

  const createMutation = useCreatePayement()
  const updateMutation = useUpdatePayement()
  const deleteMutation = useDeletePayement()

  return {
    // Query
    data: dataQueryById.data || [],
    isLoading: dataQueryById.isLoading,
    error: dataQueryById.error,
    refetch: dataQueryById.refetch,
    
    // Mutations
    createPayement: createMutation,
    updatePayement: updateMutation,
    deletePayement: deleteMutation,
    
    // Actions combinées
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['payements'] })
    }
  }
}








