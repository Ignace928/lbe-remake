import React, { useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { LucideHome } from 'lucide-react'
import { TypeFraisTable } from '@/features/frais/view/typeFrais_table'
import { useAuthStore } from '@/store/authStore'
import LoadingPage from '@/components/loadingPage'
import { useRouter } from 'next/router'
import SidebarMotion from '@/components/layout/Sidebar_Motion'



// function PageTitleBar({
//   title,
//   actions,
//   navigation,
// }: {
//   title: string
//   actions?: React.ReactNode
//   navigation?: React.ReactNode
// }) {

//   return (
//     <div className="[&>div]:mb-0!">
//       <TitleComponent Icon={Wallet}>
//         <div className="min-w-0 flex-1">
//           <p className="text-lg font-bold text-foreground">{title}</p>
//         </div>
//         <div className="flex shrink-0 flex-wrap items-center gap-2">
//           {actions}
//           {navigation}
//         </div>
//       </TitleComponent>
//     </div>
//   )
// }


export default function CashPage() {

    const {user, hasHydrated} = useAuthStore()
    const router = useRouter()
    useEffect(() => {
      if (!hasHydrated) return
      
      if(!user) window.location.href = '/'
      else if (user.role === "admin") window.location.href = "/admin"
    }, [user, hasHydrated])
  

  if(!hasHydrated) return (<LoadingPage size={40}/>)

  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Frais</title>
      </Head>
      

      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Frais & Scolarite'>
            <Button className='m-1 h-10 w-10 rounded-full' onClick={()=>router.push("/home")}>
              <LucideHome />
            </Button>
          </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
            <TypeFraisTable/>
          </Card>
          <SidebarMotion current='/frais'/>
        </main>
      </div>
    </>
  )
}




{/* <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6'>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Recouvrements du mois</p>
                <p className='mt-2 text-3xl font-black text-foreground'>82%</p>
                <Progress value={82} className='mt-3' />
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Montant collecté</p>
                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-3xl font-black text-foreground'>2.4M</p>
                  <Wallet className='h-6 w-6 text-primary' />
                </div>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Paiements valides</p>
                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-3xl font-black text-foreground'>124</p>
                  <BadgeCheck className='h-6 w-6 text-primary' />
                </div>
              </Card>
            </div> */}