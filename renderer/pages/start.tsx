import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  LogOutIcon,
  Plus,
  Power,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import LoadingPage from '@/components/loadingPage'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LogoutButton } from '@/components/LogoutButton'

export default function StarterPage() {
  
  const [me, setMe] = useState('')
  const {setAnne_active, anne_Active} = useAnneeStore()
  const {user, hasHydrated} = useAuthStore()
  const {data, isLoading, error} = useDatabaseStatusQuery()
  // Debug logs pour comprendre ce qui se passe
  useEffect(()=>{
    if (!hasHydrated) return // Attendre l'hydratation officielle
    
    if(!user) window.location.href = '/'
    else{
      setMe(user.nom_user)
    }
  },[user, hasHydrated])
  
  const go = () => {
    if (typeof window !== 'undefined') window.location.href = "/home"
  }
  
  const Add_annee = () => {
    alert("add année")
  }
  
  const menu = [
    {
      id_annee: 1,
      libelle: '2023-2024',
    },
    {
      id_annee: 2,
      libelle: '2024-2025',
    },
    {
      id_annee: 3,
      libelle: '2025-2026',
    },
  ]

  if(isLoading || !hasHydrated) return (<LoadingPage size={40}/>)

  // Vérifier si la base de données est initialisée
  if(error || !data?.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <Power className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Base de données non initialisée
              </h2>
              <p className="text-gray-600 mb-4">
                {data?.message || 'Veuillez contacter l\'administrateur pour synchroniser la base de données.'}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  <strong>Action requise :</strong> Utilisez le bouton "Sync" dans l'interface de gestion des bases de données pour initialiser la connexion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si la base de données est initialisée, afficher les années scolaires
  console.log('Base de données initialisée, affichage des années scolaires:', data)

  return (
    <React.Fragment>
      <Head>
        <title>Set Anne scolaire</title>
      </Head>
      
      {/* Vérification de l'état de la base de données au démarrage */}
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title={`Bienvenue 👋 ${me} `}>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                    <LogOutIcon/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className='text-[#1A1A1D] text-2xl'>
                    <AlertDialogTitle>
                        Se deconnecter
                    </AlertDialogTitle>
                </AlertDialogHeader>
              
              <AlertDialogDescription className='text-[#252324] text-lg font-extralight'>Voulez-vous vous deconnecter 💤?</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary', className:'rounded-full'})}>Annuler</AlertDialogCancel>

                <LogoutButton  className='rounded-full cursor-pointer' variant='default'/>
        
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HeaderComponent>
      </div>
      <main className='app-page'>
        <section className='app-page-content'>
          

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-5 lg:gap-5'>
            {menu.map((item) => (
                <Card
                  key={item.id_annee}
                  className='group h-full min-h-36 cursor-pointer border-lime-500/60 bg-white/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
                  onClick={()=>{
                    setAnne_active({
                      id_anne:item.id_annee,
                      labelle:item.libelle
                    })
                    go()
                  }}
                  role='button'
                  tabIndex={0}
                >
                  <CardContent className='flex flex-col items-center justify-center gap-3 p-4 sm:p-5'>
                    <span className='font-semibold text-slate-900'>{item.libelle}</span>
                    <div className='rounded-full bg-lime-100 p-2 text-lime-700 transition-colors group-hover:bg-lime-200'>
                      <Power className='h-5 w-5 sm:h-6 sm:w-6' />
                    </div>
                  </CardContent>
                  <CardDescription className='px-4 pb-4 text-left text-sm leading-relaxed text-slate-700 sm:px-5 sm:pb-5'>
                  </CardDescription>
                </Card>
            ))}
            <Card
                className='group h-full min-h-36 cursor-pointer border-2 border-dashed border-lime-500/60 bg-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
                onClick={Add_annee}
                role='button'
                tabIndex={0}
                >
                <CardContent className='flex items-center justify-center gap-3 p-4 sm:p-5'>
                    <div className='rounded-full p-2 text-secondary border border-dashed transition-colors group-hover:bg-lime-200 group-hover:text-lime-700'>
                        <Plus className='h-5 w-5 sm:h-6 sm:w-6' />
                    </div>
                    <span className='font-semibold text-slate-900'></span>
                </CardContent>
                <CardDescription className='px-4 pb-4 text-center text-sm leading-relaxed text-secondary sm:px-5 sm:pb-5'>
                    Nouvelle Année scolaire
                </CardDescription>
            </Card>
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}
