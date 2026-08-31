import React, { useState } from 'react'
import { usePayeParClasse } from '../viz_VModel'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { SearchInput } from '@/components/search_input'
import { Progress } from '@/components/ui/progress'

type Props = {
    id_anne:string
}

export default function Recouvrement({id_anne}: Props) {
    const [searchTerm, setSearchTerm] = useState("")
    const {data:res, isLoading, error} = usePayeParClasse(id_anne)
    const filteredData = React.useMemo(() => {
        return res?.data.filter((classe: any) => {
            const matchesSearch = !searchTerm || 
            classe.nom_classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classe.niveau?.toLowerCase().includes(searchTerm.toLowerCase())
            
            
            return matchesSearch
        })
    }, [res, searchTerm])
    if(isLoading){
        return(
            <Card className='p-4 w-full flex items-center justify-center border-0'>
                <Loader2 className='animate-spin'/>
            </Card>
        )
    }else if(error){
        return(
            <Card className='p-4 w-full flex flex-col gap-4 items-center justify-center border-0'>
                <p className='text-6xl'>😪</p>
                <p>{error.message}</p>
            </Card>
        )
    }

  return (
    <section className='flex flex-col w-full gap-1'>
        <div className='sticky top-20 backdrop-blur-xs p-4'>
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                label=''
            />
        </div>
        {
            filteredData.map((classe)=>(
                <Card className='p-4 border-primary/50 grid grid-cols-7 items-center' key={classe.id_classe}>
                    
                    <p className='text-lg font-semibold'>{classe.nom_classe}</p>
                    <p className='text-lg font-semibold'>{classe.niveau}</p>
                    <div className='flex gap-2 items-baseline'>
                        <p className='text-xs'>Effectif:</p>
                        <p className='text-lg font-semibold'>{classe.nb_inscrits}</p>
                    </div>

                    <div className='flex items-baseline gap-2 text-lime-600 font-bold'>
                        <p className='text-lg'>{classe.nb_a_jour}</p>
                        <p className='text-xs font-extralight'>Réglé</p>
                    </div>
                    <div className='flex items-baseline gap-2 text-amber-600 font-bold'>
                        <p className='text-lg'>{classe.nb_en_retard}</p>
                        <p className='text-xs font-extralight'>En attente </p>
                    </div>
                    
                    {
                        classe.taux_recouv?(
                            <div className='flex items-center col-span-2 gap-2'>
                                <div className='flex flex-col gap-0 w-full'>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-xs'>Recouvrement  :</p>
                                        <p className='text-sm font-bold pl-4'>{classe.taux_recouv}</p>
                                        <p className='text-sm font-bold'>%</p>
                                    </div>
                                    <Progress value={classe.taux_recouv}/>
                                </div>
                            </div>
                        ):(<p className='text-sm'>Auccun tarif / payement 😴!</p>)
                    }
                </Card>
            ))
        }
    </section>
  )
}