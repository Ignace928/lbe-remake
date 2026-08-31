import { useQuery } from "@tanstack/react-query"
import { api } from "./viz_service"

export const useKpiGlobal = (id:string)=>{
    return useQuery({
        queryKey:["kpiGlobal"],
        queryFn:()=>api.kpiGlobal(id),
        staleTime:1000*60*5
    })
}

export const useEffectifClasse = (id:string)=>{
    return useQuery({
        queryKey:['effectifTotale'],
        queryFn:()=>api.effectifsClasse(id),
        staleTime:1000*60*5
    })
}

export const usePayeParClasse = (id:string)=>{
    return useQuery({
        queryKey:['payement-par-classe'],
        queryFn:()=>api.paiementParClasse(id),
        staleTime:1000*60*5
    })
}

export const useElevePending = (id_anne:string, id_classe:number)=>{
    return useQuery({
        queryKey:['pending', id_anne, id_classe],
        queryFn:()=>api.elevesEnRetard(id_anne,id_classe),
        staleTime:1000*60*2
    })
}

export const usePayementParFrais = (id:string)=>{
    return useQuery({
        queryKey:['paiement-par-frais'],
        queryFn:()=>api.paiementParTypeFrais(id),
        staleTime:1000*60*5
    })
}

export const usePayementEnRetard = (id_annee:string, id_classe:number, limit?:number, offset?:number)=>{
    return useQuery({
        queryKey:[id_annee,id_classe,limit,offset],
        queryFn:()=>api.elevesEnRetard(id_annee, id_classe, limit, offset),
        staleTime:1000*60*5
    })
}