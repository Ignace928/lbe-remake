import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  DatabaseZap,
  LucideUsers,
  Power,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { MiniCard } from '@/components/miniCard'
import LoadingPage from '@/components/loadingPage'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LogoutButton } from '@/components/LogoutButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/store/authStore'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'

export default function HomePage() {
  // const go = (path: string) => {
  //   if (typeof window !== 'undefined') window.location.href = path
  // }
  const [me, setMe] = useState("")
  const {user, hasHydrated} = useAuthStore()
  const { isLoading } = useDatabaseStatusQuery()

  useEffect(() => {
    if (!hasHydrated) return
    
    if(!user) window.location.href = '/'
    else if(user.role!=="admin") window.location.href = "/"
    else{
      setMe(user.nom_user)
    }
  }, [user, hasHydrated])

  
  const menu = [
    {
      title: 'Base de données',
      description: 'Gerer la source et la base de données',
      icon: DatabaseZap,
      route: '/admin/database',
    },
    {
      title: 'Utilisateurs',
      description: 'Gerer les privilèges et/ou les comptes utilisateurs',
      icon: LucideUsers,
      route: '/admin/users',
    },
    
  ]
  if(isLoading || !hasHydrated) return (<LoadingPage size={40}/>)
  return (
    <React.Fragment>
      <Head>
        <title>Administrateur - LBE Schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2 backdrop-blur-sm'>
        <HeaderComponent title='Administrateur'>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                    <Power/>
            </AlertDialogTrigger>
            <AlertDialogContent className='text-sidebar-foreground border-primary'>
                <AlertDialogHeader className='text-2xl'>
                    <AlertDialogTitle>
                        Se deconnecter
                    </AlertDialogTitle>
                </AlertDialogHeader>
              
              <AlertDialogDescription className='text-lg'>Voulez-vous vous deconnecter 💤?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary', className:'rounded-full'})}>Annuler</AlertDialogCancel>

                <LogoutButton  className='rounded-full cursor-pointer' variant='default'/>
        
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HeaderComponent>
      </div>
      <main className='app-page fixed w-full h-screen overflow-hidden pt-20'> {/* Offset pour le header fixe */}
        <ScrollArea className='h-full border-2 border-primary/20 rounded-3xl p-3 shadow-lg shadow-primary/10'>
            <section className='app-page-content'>
              <div className='mb-6 rounded-2xl bg-card p-4 shadow-sm sm:p-5'>
                <h1 className='text-xl font-bold text-foreground sm:text-2xl'>Bienvenue {me}✨</h1>
                <p className='mt-1 text-sm text-muted-foreground sm:text-base'>
                  Choisis un module pour continuer. L&apos;interface est optimisee pour mobile, tablette
                  et desktop.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
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

              <div className='flex flex-row gap-4 mt-6 rounded-xl p-3 bg-card sm:text-sm'>
                <p className='text-card-foreground font-bold'>NB :</p> <p className='text-destructive'>Toute actions dans la page administrateur touche directement au systeme🧧.</p>
              </div>
            </section>
        </ScrollArea>
      </main>
    </React.Fragment>
  )
}
