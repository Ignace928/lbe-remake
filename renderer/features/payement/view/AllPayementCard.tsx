import React from 'react'
import { usePayementById } from '../payement_VModel'
import { Card  } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { payementByIdType } from '../payement.types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { nombre } from '@/lib/convertisseur'
type allPayementCardProps = {
    id_inscription:number
    showPayement:(paye:payementByIdType)=>void
}
export const AllPayementCard = ({id_inscription, showPayement}:allPayementCardProps) => {
    const {data:res, isLoading, error} = usePayementById({id_inscription})
    if(isLoading){
        return(
            <div className="p-4 h-full flex justify-center rounded-md">
                <Card className='mt-4 p-3 flex w-full h-30 justify-center items-center border-primary'>
                    <Loader2 className='animate-spin text-primary'/>
                </Card>
            </div>
        )
    }else if(error){
        return (<p className='text-sm text-red-500'>Erreur de récupération</p>)
    }
    if(res.data.length===0){
        return(
            <div className="p-4 h-full flex justify-center rounded-md">
                <Card className='mt-4 p-3 flex w-full h-30 justify-center items-center border-primary animate-pulse'>
                    Auccun payement trouvée
                </Card>
            </div>
        )
    }else
    return (
        <ScrollArea className='p-4 h-full'>
            {
                res.data.map((p: payementByIdType)=>(
                    <Card onClick={()=>console.log("Payement:",p)} key={p.id_paiement} onDoubleClick={()=>showPayement(p)} className='mt-4 p-3 rounded-md border-primary hover:bg-primary/20 cursor-pointer'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col gap-4 w-full'>
                                <div className='flex justify-between items-center '>
                                    <p className='border-b px-1 text-xs'>Ref : {p.ref}</p>
                                    <p className='text-sm font-semibold'>{p?.date_paiement && format(new Date(p.date_paiement), "dd MMMM yyyy", { locale: fr })}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <p className='text-xs font-extralight'>Montant :</p>
                                    <p className='text-lg font-semibold'>{nombre.formatMontant(p.montant_paye)} Ar</p>
                                </div>
                                <div className='flex flex-col gap-2 items-start'>
                                    <Badge className='text-sm border-primary' variant='outline'>{p.typeFrais.libelle}</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))
            }
        </ScrollArea>
    )
    
}




