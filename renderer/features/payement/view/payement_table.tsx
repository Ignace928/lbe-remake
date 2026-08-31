import { TitleComponent } from "@/components/layout/title_component"
import LoadingPage from "@/components/loadingPage"
import { Button, buttonVariants } from "@/components/ui"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePayementParFrais } from "@/features/visualisation/viz_VModel"
import { useAnneeStore } from "@/store/anneStore"
import { useAuthStore } from "@/store/authStore"

import { BadgeDollarSignIcon, Calculator, DollarSign, DollarSignIcon, Loader2, PlusSquareIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"


export default function PayementTable(){

    const {user, hasHydrated} = useAuthStore()
    const router = useRouter()
    const anne = useAnneeStore().anne_Active
    useEffect(() => {
      if (!hasHydrated) return
      
      if(!user) window.location.href = '/'
      else if (user.role === "admin") window.location.href = "/admin"
    }, [user, hasHydrated])
    

    if(!hasHydrated) return (<LoadingPage size={40}/>)
    
    return(
            <PayementListe id_anne={anne.id_anne} />
    )
    
}


const PayementListe = ({id_anne}:{id_anne:string})=>{
    const router = useRouter()
    const {data:res,isLoading,error} = usePayementParFrais(id_anne)
    const rendering = ()=> {
        if(isLoading){
            return(    
                <Card className="border-0 w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin"/>
                </Card>
            )
        }else if(error){
            return(
                <Card className="border-0 w-full h-full flex flex-col gap-4 items-center justify-center">
                    <p className="text-6xl">😥</p>
                    <p>{error.message}</p>
                </Card>
            )
        }else return(
            <section className="grid lg:grid-cols-4 sm:grid-cols-3 gap-4 pt-4">
                {
                    res.data.map((e)=>(
                        <Card onClick={()=>router.push('/paiements/addNew')} key={e.id_type_frais} className='group cursor-pointer hover:scale-105 transition-all duration-75 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4 h-40'>
                            <div className="group group-hover:flex hidden w-full h-full  items-center justify-center">
                                <p>Effectuer un payement</p>
                            </div>

                            <div className="group group-hover:hidden">
                                <p className='text-sm text-muted-foreground'>{e.libelle}</p>
                                <div className='flex gap-2 items-baseline '>
                                    <p className='text-xs text-muted-foreground'>En caisse</p>
                                    <p className='text-xs'>{e.encaisse}</p>
                                    <p className='text-md font-semibold'>Ar</p>
                                </div>
                                <div className='flex gap-2 items-baseline '>
                                    <p className='text-xs text-muted-foreground'>Attendu</p>
                                    <p className='text-xs'>{e.attendu}</p>
                                    <p className='text-md font-semibold'>Ar</p>
                                </div>
                                <div className='flex gap-2 items-baseline '>
                                    <p className='text-xs text-muted-foreground'>reste</p>
                                    <p className='text-xs'>{e.solde}</p>
                                    <p className='text-md font-semibold'>Ar</p>
                                </div>
                                <div className='flex gap-2 items-baseline text-xs'>
                                    <Progress value={e.taux_recouv}/>{e.taux_recouv}%
                                </div>
                            </div>
                        </Card>
                    ))
                }
                
            </section>
        )
    }
    return(
        <Card className="min-h-0 h-full border-0">
        <   ScrollArea className="min-h-0 h-full">
            <TitleComponent Icon={DollarSign}>
                <div className='flex-1'>
                    <p className='text-lg font-bold'>Suivi des payements</p>
                    <p>Les payement effectués</p>
                </div>
                
                <Button onClick={()=>router.push("/paiements/addNew")}><BadgeDollarSignIcon/>Effectuer un payement</Button>
            </TitleComponent>
            <div className="sticky top-0 p-4 w-full">
                <h1 className="text-3xl font-bold">Status de payement / Frais</h1>
            </div>
                {
                    rendering()
                }
            </ScrollArea>
        </Card>
        
    )
}