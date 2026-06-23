import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  BookMarkedIcon,
  DollarSignIcon,
  GraduationCapIcon,
  Home,
  LayoutDashboard,
  LucideUsers,
  Wallet,
} from 'lucide-react'
import { MiniCard } from '@/components/miniCard'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import LoadingPage from '@/components/loadingPage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { TitleComponent } from '@/components/layout/title_component'

export default function HomePage() {
  const { anne_Active } = useAnneeStore()
  const {user, hasHydrated} = useAuthStore()
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(()=>{
    if (!hasHydrated) return // Attendre l'hydratation officielle
    
    if(!user) window.location.href = '/'
    else{
      // Vérifier si une année scolaire est active
      if(!anne_Active.id_anne){
        window.location.href = '/start'
      }
      else setLoading(false)
    }
  },[anne_Active, user, hasHydrated])
  

  const menu = [
    {
      title: 'Vue globale',
      description: 'Tableau de bord',
      icon: LayoutDashboard,
      route:'/dashboard',
    },
    {
      title: 'Classes',
      description: 'Gerer les classes existantes',
      icon: BookMarkedIcon,
      route:'/classe',
    },
    {
      title: 'Elèves',
      description: 'Gerer les informations des eleves',
      icon: LucideUsers,
      route:'/etudiant',
    },
    {
      title: 'Inscriptions',
      description: `Gerer l'inscription / réinscription pour l'année ${anne_Active.labelle}`,
      icon: GraduationCapIcon,
      route:'/inscription',
    },
    {
      title: 'Frais de Scolarité',
      description: "Gérez les Frais / Tarifs de l'établissement",
      icon: Wallet,
      route:'/frais',
    },
    {
      title: 'Payements',
      description: "Suivre les payements effectué",
      icon: DollarSignIcon,
      route:'/paiements',
    }
  ]
  if(loading || !hasHydrated) return(<LoadingPage size={40}/>)
  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Accueil</title>
      </Head>
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Accueil'>
            
          </HeaderComponent>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">        
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
              <ScrollArea>
                <TitleComponent Icon={Home}>
                    <div className='flex-1'>
                      <p className='text-lg font-bold text-foreground'>Année Scolaire Active</p>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        👉 {anne_Active.labelle}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                      Session active
                    </span>
                </TitleComponent>
{/* ______________________________________________STYLE_____________________________________________________ */}
                <div className="grid grid-cols-2 gap-20 justify-end z-2 pr-30 absolute top-4 right-0">
                  <p className="h-10 w-15 rounded bg-amber-800 dark:bg-amber-500"></p>
                  <p className="h-10 w-15 rounded bg-lime-700 dark:bg-lime-500"></p>
                </div>

                
              <div className='mb-6'>
                <p className='text-lg p-4 font-bold text-foreground '>Modules disponibles</p>
                <div className='grid px-4 gap-4 grid-cols-3 lg:grid-cols-4 lg:gap-5'>
                  {menu.map((item) => (
                    <MiniCard
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      description={item.description}
                      to={item.route}
                    />
                  ))}
                </div>
              </div>
              <div className='sticky z-1 bottom-0 rounded-xl flex flex-row sm:text-sm my-4 mx-6 gap-1 mt-6 bg-card p-4'>   
                  <p className='text-card-foreground font-bold'>
                    Astuce:
                  </p>
                  <p className='dark:text-amber-400'>
                    💡 Utilisez les cartes pour naviguer rapidement vers les ecrans de gestion
                  </p>
              </div>

            </ScrollArea>
            </Card>
        </main>
      </div>
    </>

  )
}
