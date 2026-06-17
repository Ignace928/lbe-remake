import React, { useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon, Loader2, LucideLayoutDashboard } from 'lucide-react'
import { useAnneeStore } from '@/store/anneStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/router'
import KpiGlobal from '@/features/visualisation/view/kpiGlobal'
import { TitleComponent } from '@/components/layout/title_component'
import { useAuthStore } from '@/store/authStore'
import LoadingPage from '@/components/loadingPage'
import { useVisual } from '@/store/viz'
import EffectifClasse from '@/features/visualisation/view/effectifClasse'
import Recouvrement from '@/features/visualisation/view/Recouvrement'

export default function BoardPage() {
  const {anne_Active} = useAnneeStore()
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
    if(viz==="statistique"){
      return(<EffectifClasse id={anne_Active.id_anne}/>)
    }else if(viz==="recouvrement"){
      return(<Recouvrement id_anne={anne_Active.id_anne}/>)
    }
    else return(
     "" 
    )
  }
  return (
    <>
      <Head>
        <title>Tableau de bord - LBE Schoolar</title>
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
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Tableau de bord</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {anne_Active.labelle}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  ID: {anne_Active.id_anne}
                </span>
              </TitleComponent>
              

              <div className='py-4'>
                <KpiGlobal id_anne={anne_Active.id_anne}/>
              </div>
              {
                rendering()
              }
              
            </ScrollArea>
          </Card>  
        </main>


      </div>
    </>
  )
}
