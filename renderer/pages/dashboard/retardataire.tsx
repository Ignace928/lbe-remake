import { SelectClasse } from '@/components/classe/classe_select'
import { HeaderComponent } from '@/components/layout/header'
import SidebarMotion from '@/components/layout/Sidebar_Motion'
import { TitleComponent } from '@/components/layout/title_component'
import LoadingPage from '@/components/loadingPage'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePayementEnRetard } from '@/features/visualisation/viz_VModel'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import { useVisual } from '@/store/viz'
import { ArrowLeftFromLineIcon, Loader, LucideLayoutDashboard } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function retardataireList(){
    const {anne_Active} = useAnneeStore()
    const [classe, setClasse] = useState(0)
    const viz = useVisual()
    const router = useRouter()
    const {user, hasHydrated} = useAuthStore()
    useEffect(() => {
    if (!hasHydrated) return
    
    if(!user) window.location.href = '/'
    else if (user.role === "admin") window.location.href = "/admin"
    }, [user, hasHydrated])
        
      
    if(!hasHydrated) return (<LoadingPage size={40}/>)
    const rendering = ()=>{
        if(classe===0){
            return("")
        }else{
            return(<Rendering anne={anne_Active.id_anne} classe={classe}/>)
        }
    }
  return (
    <>
      <Head>
        <title>Retardataire - LBE Schoolar</title>
      </Head>

      <div className="flex h-dvh flex-col overflow-hidden">

        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Vue globale'>
            <Button className='w-10 h-10 m-1 rounded-full' onClick={()=>router.push('/home')}>
              <ArrowLeftFromLineIcon/>
            </Button>
          </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">
            <ScrollArea className="min-h-0 flex flex-col h-full">
              <TitleComponent Icon={LucideLayoutDashboard}>
                <SelectClasse Click={setClasse}/>
              </TitleComponent>

              <div className='py-4'>
                {
                  rendering()
                }
              </div>
            </ScrollArea>
          </Card>  
          <SidebarMotion current='/dashboard'/>
        </main>
      </div>
    </>
  )
}
type props={
  anne:string
  classe:number
}
export const Rendering = ({anne, classe}:props) => {
  const {data:res, isLoading, isError} = usePayementEnRetard(anne,classe,100,0)
  if(isLoading){
    return(
      <div>
        <Loader className='animate-spin'/>
      </div>
    )
  }else if(isError){
    return(<Loader className='text-red-700 animate-spin'/>)
  }
  return(
    <div className='flex'>
      <Table>
        <TableHeader className='relative'>
            <TableRow className='border-primary/10 sticky top-0 hover:bg-primary/5'>
                <TableHead className='text-foreground'>Classe</TableHead>
                <TableHead className='text-foreground'>Matricule</TableHead>
                <TableHead className='text-foreground'>Nom (complet)</TableHead>
                <TableHead className='text-foreground'>Somme versée</TableHead>
                <TableHead className='text-foreground'>Total du</TableHead>
                <TableHead className='text-foreground'>Ecart</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                res.data.map((eleve) =>(
                    <TableRow key={eleve.id_eleve} className='border-primary/10 hover:cursor-pointer hover:bg-primary/5'>
                        <TableCell className='font-mono text-xs text-muted-foreground sm:text-sm'>{eleve.nom_classe}</TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground sm:text-sm'>{eleve.matricule}</TableCell>
                        <TableCell className='text-muted-foreground'>{eleve.nom_complet}</TableCell>
                        <TableCell className='text-muted-foreground'>{eleve.somme_versee}</TableCell>
                        <TableCell className='text-muted-foreground'>{eleve.total_du}</TableCell>
                        <TableCell className='font-medium text-foreground'>{eleve.ecart}</TableCell>
                    </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}