import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useEffectifClasse } from '../viz_VModel'
import { PieChart } from '@/components/charts'
import { SearchInput } from '@/components/search_input'

type Props = {
    id:string
}

export default function EffectifClasse({id}: Props) {
    const {data:res, isLoading, error} = useEffectifClasse(id)
    const [searchTerm, setSearchTerm] = useState("")
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
        <div className='flex flex-col gap-4'>
            <div className='sticky top-20 backdrop-blur-xs p-4'>
                <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    label=''
                />
            </div>
            <section className='p-4 w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4 border-0'>
                {
                    filteredData.map((classe)=>(
                        <Card className='text-foreground border-primary/50 bg-linear-to-br from-muted/50 to-card' key={classe.id_classe}>
                            <div className='flex justify-between pt-4 px-6'>
                                <p className='text-xl font-semibold'>{classe.nom_classe}</p>
                                <div className='flex items-baseline-last justify-center gap-1'>
                                    <p className='text-sm'>Effectif</p>
                                    <p className='text-xl font-bold'>{classe.total}</p>
                                </div>
                            </div>
                            <PieChart
                                data={[{name:"Fille",nb:classe.nb_femmes}, {name:"Garçon",nb:classe.nb_hommes}]}
                                dataKey='nb'
                                height={200}
                                nameKey="label"
                                showLegend={true}
                                colors={["crimson", "#058888"]}
                            />
                        </Card>
                    ))
                }

            </section>
        </div>
    )
}