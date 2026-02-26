import React, { useActionState, useEffect, useState } from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  BookMarkedIcon,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  LucideUsers,
  PowerOffIcon,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { MiniCard } from '@/components/miniCard'
import { useAnneeStore } from '@/store/anneStore'
import LoadingPage from '@/components/loadingPage'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LogoutButton } from '@/components/LogoutButton'

export default function HomePage() {
  const {anne_Active, setAnne_active} = useAnneeStore()
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(()=>{
    const anne_scolaire = JSON.parse(localStorage.getItem('anneScolaire')).state.anne_Active
    if(!anne_scolaire.id_anne){
      window.location.href = '/start'
    }
    else setLoading(false)
  },[anne_Active])
  const go = (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path
  }

  const menu = [
    {
      title: 'Vue globale',
      description: 'Tableau de bord',
      icon: LayoutDashboard,
      action: () => go('/dashboard'),
    },
    {
      title: 'Classes',
      description: 'Gerer les classes existantes',
      icon: BookMarkedIcon,
      action: () => go('/classe'),
    },
    {
      title: 'Eleves',
      description: 'Gerer les informations des eleves',
      icon: LucideUsers,
      action: () => go('/etudiant'),
    },
    {
      title: 'Frais & Scolarite',
      description: "Gerer l'inscription, la reinscription et les paiements",
      icon: GraduationCap,
      action: () => go('/frais'),
    },
  ]
  if(loading) return(<LoadingPage size={40}/>)
  return (
    <React.Fragment>
      <Head>
        <title>Home - LBE Schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2 backdrop-blur-sm'>
        <HeaderComponent title='Home'>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                <PowerOffIcon />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className='text-[#1A1A1D] text-2xl'>
                  <AlertDialogTitle>Quitter et/ou Fermer session?</AlertDialogTitle>
              </AlertDialogHeader>
              
              <AlertDialogDescription className='text-[#252324] text-lg font-extralight'>Voulez-vous fermer la session {anne_Active.labelle} et/ou vous deconnecter 💤?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary', className:" border-lime-500 rounded-full"})}>Annuler</AlertDialogCancel>

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
      <main className='app-page'>
        <section className='app-page-content'>
          <div className='mb-6 rounded-2xl border border-lime-300/70 bg-white/80 p-4 shadow-sm sm:p-5'>
            <h1 className='text-xl font-bold text-slate-900 sm:text-2xl'>Année Scolaire : {anne_Active.labelle}</h1>
            <p className='mt-1 text-sm text-slate-700 sm:text-base'>
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
                action={item.action}
              />
            ))}
          </div>

          <div className='mt-6 rounded-xl border border-lime-300/60 bg-white/75 p-3 text-xs text-slate-700 sm:text-sm'>
            Astuce: utilise les cartes pour naviguer rapidement vers les ecrans de gestion.
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}
