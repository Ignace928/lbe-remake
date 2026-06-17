import React, { useActionState, useEffect, useState } from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  BookMarkedIcon,
  DatabaseZap,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  LucideUsers,
  Power,
  UserCheck2,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { MiniCard } from '@/components/miniCard'
import { useAnneeStore } from '@/store/anneStore'
import LoadingPage from '@/components/loadingPage'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

export default function HomePage() {
  const go = (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path
  }

  const menu = [
    {
      title: 'Base de données',
      description: 'Gerer la base de données',
      icon: DatabaseZap,
      action: () => go('/admin/database'),
    },
    
  ]
  return (
    <React.Fragment>
      <Head>
        <title>Administrateur - LBE Schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2 backdrop-blur-sm'>
        <HeaderComponent title='Accueil'>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                    <Power/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className='text-[#1A1A1D] text-2xl'>
                    <AlertDialogTitle>
                        Se deconnecter
                    </AlertDialogTitle>
                </AlertDialogHeader>
              
              <AlertDialogDescription className='text-[#252324] text-lg font-extralight'>Voulez-vous vous deconnecter 💤?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary'})}>Annuler</AlertDialogCancel>

                <AlertDialogAction className='rounded-full cursor-pointer' onClick={()=>{window.location.href = '/'}}>
                  <LogOut/>
                </AlertDialogAction>

              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HeaderComponent>
      </div>
      <main className='app-page'>
        <section className='app-page-content'>
          <div className='mb-6 rounded-2xl border border-lime-300/70 bg-white/80 p-4 shadow-sm sm:p-5'>
            <h1 className='text-xl font-bold text-slate-900 sm:text-2xl'>Bienvenue ✨</h1>
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

          <div className='flex flex-row gap-4 mt-6 rounded-xl border border-lime-300/60 bg-white/75 p-3 text-xs text-slate-700 sm:text-sm'>
            <p className='font-black'>NB :</p> <p className='text-rose-600'>Toute actions dans la page administrateur touche directement au systeme🧧.</p>
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}
