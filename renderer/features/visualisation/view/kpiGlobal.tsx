import { Card } from '@/components/ui/card'
import React from 'react'
import { useKpiGlobal } from '../viz_VModel'
import { useAnneeStore } from '@/store/anneStore'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useExplore } from '@/store/viz'

type Props = {
    id_anne:string
}

export default function KpiGlobal({id_anne}: Props) {
    const {data:res,isLoading,error} = useKpiGlobal(id_anne)
    const {explore} = useExplore()
    if(isLoading)return(
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            <Card className='p-4 flex items-center justify-center h-40 border-primary/20 bg-linear-to-br from-muted/30 to-card'>
                <Loader2 className='animate-spin'/>
            </Card>
            <Card className='p-4 flex items-center justify-center h-40 border-primary/20 bg-linear-to-br from-muted/30 to-card'>
                <Loader2 className='animate-spin'/>
            </Card>
            <Card className='p-4 flex items-center justify-center h-40 border-primary/20 bg-linear-to-br from-muted/30 to-card'>
                <Loader2 className='animate-spin'/>
            </Card>
            <Card className='p-4 flex items-center justify-center h-40 border-primary/20 bg-linear-to-br from-muted/30 to-card'>
                <Loader2 className='animate-spin'/>
            </Card>
        </div>
    )
    if(error)return(
        <Card className='p-4 flex items-center justify-center'>
            <>😥:{error.message}</>
        </Card>
    )
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
        <Card className='cursor-pointer hover:scale-105 transition-all duration-100 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4'
            onClick={_=>explore("statistique")}
        >
            <p className='text-sm text-muted-foreground'>Statistiques</p>
            <div className='flex gap-2 items-baseline text-foreground text-2xl font-bold'>
                <p className='mt-2 text-3xl'>{res.data.total_inscrits}</p>
                <p className=''>Inscrit</p>
            </div>
            
        </Card>


        <Card className='cursor-pointer hover:scale-105 transition-all duration-100 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4' 
            onClick={()=>explore("recouvrement")}
        >
            <p className='text-sm text-muted-foreground'>Performance</p>
            <div className='flex gap-2 items-baseline text-lime-600 text-2xl font-bold'>
                <p className='mt-2 font-bold'>{res.data.nb_eleves_a_jour} /</p>
                <p className=''> {res.data.total_inscrits}</p>
                <p className=''>Réglé</p>
            </div>
        </Card>

        <Card className='cursor-pointer hover:scale-105 transition-all duration-100 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4' 
            onClick={()=>explore("recouvrement")}
        >
            <p className='text-sm text-muted-foreground'>En attente</p>
            <div className='flex gap-2 items-baseline text-2xl font-bold text-amber-600'>
                <p className='mt-2'>{res.data.nb_eleves_en_retard}</p>
                <p className=''>Elèves</p>
            </div>
        </Card>


        <Card className='cursor-pointer hover:scale-105 transition-all duration-100 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4' 
            onClick={()=>explore("recouvrement")}
        >
            <p className='text-sm text-muted-foreground'>Taux de recouvrement</p>
            <div className='flex items-center gap-4 pb-6'>
                <Progress value={res.data.taux_recouvrement} className='mt-3' />
                <p className='mt-2 text-xl font-bold text-foreground'>{res.data.taux_recouvrement}%</p>
            </div>
            <div className='flex gap-2 items-baseline'>
                <p className='text-xs text-foreground'>Target</p>
                <p className='text-md font-bold text-foreground'>{res.data.total_attendu}</p>
            </div>
            <div className='flex gap-2 items-baseline '>
                <p className='text-xs text-foreground'>Caisse</p>
                <p className='text-md font-bold text-foreground'>{res.data.total_encaisse}</p>
            </div>
        </Card>

    </div>
  )
}