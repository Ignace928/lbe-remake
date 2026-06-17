import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
import { useAnneeScolaireVm } from '@/features/anneescolaire/anneeScolaire_VModel'
import { CreateAnneeScolaire } from '@/features/anneescolaire/anneeScolaire_types'
import { AnneeScolaireForm } from '@/features/anneescolaire/view/anneeScolaire_form'
import LoadingPage from '@/components/loadingPage'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LogoutButton } from '@/components/LogoutButton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TitleComponent } from '@/components/layout/title_component'
import { useTarifVm } from '@/features/tarifs/tarif_VModel'

export default function StarterPage() {
  
  const router = useRouter()
  const [me, setMe] = useState('')
  const {setAnne_active} = useAnneeStore()
  const {user, hasHydrated} = useAuthStore()
  const {data, isLoading, error} = useDatabaseStatusQuery()
  const {invalidateQueries} = useTarifVm()
  const { data: anneesScolaires, isLoading: isLoadingAnnees, createAnneeScolaire } = useAnneeScolaireVm()
  // Debug logs pour comprendre ce qui se passe
  useEffect(()=>{
    if (!hasHydrated) return // Attendre l'hydratation officielle
    
    if(!user) window.location.href = '/'
    else if(user.role==="admin"){
      setMe(user.nom_user)
      router.push("/admin")
    }
    else{
      setMe(user.nom_user)
    }
  },[user, hasHydrated])
  
  const go = () => {
    router.push('/home')
  }
  
  const [showAddForm, setShowAddForm] = useState(false)

  const Add_annee = () => {
    setShowAddForm(true)
  }

  const handleCreateAnneeScolaire = async (data: CreateAnneeScolaire) => {
    try {
      await createAnneeScolaire.mutateAsync(data)
      setShowAddForm(false) // Fermer le formulaire après la création
    } catch (err) {
      console.error('Error creating annee scolaire:', err)
    }
  }

  if(isLoading || !hasHydrated || isLoadingAnnees) return (<LoadingPage size={40}/>)

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

  return (
    <>
      <Head>
        <title>Let's start</title>
      </Head>
      
      {/* Vérification de l'état de la base de données au démarrage */}
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
            <HeaderComponent title={`Bienvenue 👋 ${me} `}>            
            </HeaderComponent>
        </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
        <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
          <ScrollArea className='min-h-0 flex flex-col h-full'>




            <TitleComponent Icon={Power}>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Sélectionner une année scolaire</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 Choisissez l'année académique pour commencer
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  {anneesScolaires?.length || 0} disponibles
                </span>
            </TitleComponent>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-5 lg:gap-5 py-4'>
              {anneesScolaires?.map((item) => (
                  <Card
                    key={item.id_annee}
                    className='group h-full min-h-36 cursor-pointer border-2 border-primary/20 text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-xl bg-linear-to-br from-muted/20 to-card'
                    onClick={()=>{
                      try {
                        setAnne_active({
                          id_anne: item.id_annee,
                          labelle: item.libelle
                        })
                        invalidateQueries()
                        go()
                      } catch (error) {
                        console.error('Erreur dans le onClick:', error)
                      }
                    }}
                    role='button'
                    tabIndex={0}
                  >
                    <CardContent className='flex flex-col items-center justify-center gap-3 p-4 sm:p-5'>
                      <span className='font-semibold text-foreground'>{item.libelle}</span>
                      <div className='rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
                        <Power className='h-5 w-5 sm:h-6 sm:w-6' />
                      </div>
                    </CardContent>
                    <CardDescription className='px-4 pb-4 text-left text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5'>
                    </CardDescription>
                  </Card>
              ))}

              <Card
                className='group bg-muted border-2 border-dashed border-primary/20 h-full min-h-36 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
                onClick={Add_annee}
                role='button'
                tabIndex={0}
              >
                <CardContent className='w-full h-full flex items-center justify-center gap-3 p-4 sm:p-5'>
                  <div className='rounded-full p-2 text-muted-foreground border-2 border-dashed border-primary/20 transition-colors bg-muted group-hover:bg-primary/10 group-hover:text-primary'>
                    <Plus className='h-5 w-5 sm:h-6 sm:w-6' />
                  </div>
                </CardContent>
                <CardDescription className='px-4 pb-4 text-center text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5'>
                </CardDescription>
              </Card>

              {/* Formulaire d'ajout d'année scolaire */}
              <AnneeScolaireForm
                size="default"
                variant="default"
                style=""
                trigger={null} // Pas de trigger car on utilise showAddForm
                onSubmit={handleCreateAnneeScolaire}
                isLoading={createAnneeScolaire.isPending}
                title="Ajouter une année scolaire"
                description="Créez une nouvelle année scolaire."
                submitButtonText="Créer"
                open={showAddForm}
                onOpenChange={setShowAddForm}
              />
            </div>


          </ScrollArea>
        </Card>
      </main>
            
      
      </div>
    </>
  )
}
