import { HeaderComponent } from '@/components/layout/header'
import SidebarMotion from '@/components/layout/Sidebar_Motion'
import LoadingPage from '@/components/loadingPage'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui/card'
import AddNewPayement from '@/features/payement/view/AddNewPayement'
import { useAuthStore } from '@/store/authStore'
import { useClearSelectedInscription } from '@/store/inscriptionStore'
import { ArrowLeftFromLine } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function NewPayement() {
    const router = useRouter()
    const {user, hasHydrated} = useAuthStore()
        useEffect(() => {
          if (!hasHydrated) return
          
          if(!user) window.location.href = '/'
          else if (user.role === "admin") window.location.href = "/admin"
        }, [user, hasHydrated])
      
    
      if(!hasHydrated) return (<LoadingPage size={40}/>)
    
    const resetSelected=useClearSelectedInscription()
  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Payements</title>
      </Head>
      

      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Payements'>
            <Button className='m-1 rounded-full' onClick={()=>{
              resetSelected()
              router.push("/paiements")
            }}>
              <ArrowLeftFromLine />Payement - page
            </Button>
          </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
            <AddNewPayement/>
          </Card>
          <SidebarMotion current='/paiements'/>
        </main>
      </div>
    </>
  )
}
