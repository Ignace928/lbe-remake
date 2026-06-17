import React, { useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { HeaderComponent } from '@/components/layout/header'
import { LucideHome } from 'lucide-react'
import { TarifTable } from '@/features/tarifs/view/tarif_table'
import { useRouter } from 'next/router'
import { Card } from '@/components/ui/card'
import SidebarMotion from '@/components/layout/Sidebar_Motion'
import { useAuthStore } from '@/store/authStore'
import LoadingPage from '@/components/loadingPage'

export default function TarifsPage() {
  const router = useRouter()
  const {user, hasHydrated} = useAuthStore()
    useEffect(() => {
      if (!hasHydrated) return
      
      if(!user) window.location.href = '/'
      else if (user.role === "admin") window.location.href = "/admin"
    }, [user, hasHydrated])
  

  if(!hasHydrated) return (<LoadingPage size={40}/>)

  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Tarifs</title>
      </Head>

      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Frais & Scolarite / TARIFS'>
            <Button className='m-1 w-10 h-10 rounded-full' onClick={()=>router.push("/home")}>
              <LucideHome />
            </Button>
          </HeaderComponent>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
            <TarifTable/>
          </Card>
          <SidebarMotion current='/frais'/>
        </main>
      </div>
    </>
  )
}
