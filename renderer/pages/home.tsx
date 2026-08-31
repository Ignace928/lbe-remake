<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
=======
import React, { useActionState, useEffect, useState } from 'react'
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  BookMarkedIcon,
  DollarSignIcon,
  GraduationCapIcon,
  Home,
  LayoutDashboard,
  LucideUsers,
<<<<<<< HEAD
  Wallet,
} from 'lucide-react'
=======
  PowerOffIcon,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
import { MiniCard } from '@/components/miniCard'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import LoadingPage from '@/components/loadingPage'
<<<<<<< HEAD
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { TitleComponent } from '@/components/layout/title_component'

export default function HomePage() {
  const { anne_Active } = useAnneeStore()
=======
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LogoutButton } from '@/components/LogoutButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  const {anne_Active, setAnne_active} = useAnneeStore()
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
  
=======
  const go = (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path
  }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

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
<<<<<<< HEAD
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

=======
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Home'>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                <PowerOffIcon />
            </AlertDialogTrigger>
            <AlertDialogContent className='border border-primary'>
              <AlertDialogHeader className='text-2xl'>
                  <AlertDialogTitle>Quitter et/ou Fermer session?</AlertDialogTitle>
              </AlertDialogHeader>
              
              <AlertDialogDescription className='text-lg font-extralight'>Voulez-vous fermer la session {anne_Active.labelle} et/ou vous deconnecter 💤?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary', className:"rounded-full"})}>Annuler</AlertDialogCancel>

                <AlertDialogAction className='rounded-full cursor-pointer' onClick={()=>{
                  setAnne_active({id_anne:null, labelle:""})
                }}>
                  Fermer session
                </AlertDialogAction>

                <LogoutButton className='rounded-full cursor-pointer' variant='default'/>

              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HeaderComponent>
      </div>
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'>
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary'>
                  <GraduationCap className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Année Scolaire Active</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {anne_Active.labelle}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  Session active
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <p className='text-lg font-bold text-foreground mb-4'>Modules disponibles</p>
              <p className='text-sm text-muted-foreground mb-6'>
                Choisis un module pour continuer. L&apos;interface est optimisee pour mobile, tablette et desktop.
              </p>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
                {menu.map((item) => (
                  <MiniCard
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                    description={item.description}
                    action={item.action}
                  />
                ))}
              </div>
            </div>

            <div className='rounded-xl border border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
              <p className='text-sm text-muted-foreground text-center'>
                💡 Astuce: utilise les cartes pour naviguer rapidement vers les ecrans de gestion.
              </p>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  )
}
