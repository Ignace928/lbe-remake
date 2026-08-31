import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { HeaderComponent } from '@/components/layout/header'
<<<<<<< HEAD
import { Users, ChevronLeft, ChevronRight, LucideHome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
=======
import { ArrowLeftFromLineIcon, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useAnneeStore } from '@/store/anneStore'
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import { useEleveVm } from '@/features/eleves/eleve_VModel'
import { EleveTable } from '@/features/eleves/view/eleve_table'
import LoadingPage from '@/components/loadingPage'
<<<<<<< HEAD
import { toast } from 'sonner'
import { playSound } from '@/lib/soundSystem'
import SidebarMotion from '@/components/layout/Sidebar_Motion'

export default function EtudiantPage() {
  const router = useRouter()
  const {user, hasHydrated} = useAuthStore()
  const {data, isLoading, error} = useDatabaseStatusQuery()

  // État pour la pagination
  const [cursor, setCursor] = useState(0)
  const limit = 100

  const { data: students, pagination, isLoading: isLoadingStudents, createEleve, updateEleve, deleteEleve, refetch } = useEleveVm({cursor, limit})

  // Handlers pour la pagination
  const handleNextPage = () => {
    if (pagination?.hasMore) {
      setCursor(cursor + limit)
    }
  }

  const handlePreviousPage = () => {
    if (cursor > 0) {
      setCursor(Math.max(0, cursor - limit))
    }
  }

  


  
  // Fonction pour générer des données d'élève de test
  // const generateTestData = (count: number) => {
  //   const noms = ['ANDRIANAVALONA', 'FIORENAMPITIAVANA', 'ANDRIAMANLINA', 'RAKOTONIAINA', 'RANDRIAMANAMPISOA', 'RALALARISOA', 'ANDRIAMANAMPISOA', 'RAKOTOARISOA', 'MAMILALAINA', 'RANDRIATSIZOVIANA']
  //   const postNoms = ['Kuruko', 'Yagami', 'Marie', 'Gojo', 'Steve', 'François', 'Paul', 'Louis Gonzague', 'Michel', 'André', 'Roger', "Felix", 'Rengoku', 'Shin', "Kojin"]
  //   const lieux = ['Mahajanga', 'Antananarivo', 'New City', 'Nagazaki', 'Ambositra', 'Kongo', 'Konoha', 'East Blue', 'Lyon', 'Marsel']
  //   const professions = ['Enseignant', 'Médecin', 'Ingénieur', 'Agriculteur', 'Commerçant', 'Fonctionnaire', 'Artisan', 'Chauffeur', 'Secrétaire', 'Comptable']
    
  //   const students = []
  //   for (let i = 0; i < count; i++) {
  //     const sexe = Math.random() > 0.5 ? 'M' : 'F'
  //     const nom = noms[Math.floor(Math.random() * noms.length)]
  //     const postNom = postNoms[Math.floor(Math.random() * postNoms.length)]
  //     const lieuNaissance = lieux[Math.floor(Math.random() * lieux.length)]
      
  //     students.push({
  //       nom_eleve: nom,
  //       post_nom_eleve: postNom,
  //       sexe: sexe as 'M' | 'F',
  //       date_naissance: new Date(2005 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  //       lieu_naissance: lieuNaissance,
  //       nationalite: 'Congolaise',
  //       adresse: `Avenue ${Math.floor(Math.random() * 100) + 1}, ${lieuNaissance}`,
  //       telephone: `+243${Math.floor(Math.random() * 900000000) + 100000000}`,
  //       email: `${nom.toLowerCase()}.${postNom.toLowerCase()}${i}@example.com`,
  //       nom_pere: `${nom} ${postNom}`,
  //       nom_mere: `Mme ${nom} ${postNom}`,
  //       profession_pere: professions[Math.floor(Math.random() * professions.length)],
  //       profession_mere: professions[Math.floor(Math.random() * professions.length)],
  //       etat: 'Actif' as const,
  //       maladie: Math.random() > 0.8 ? 'Allergie' : '',
  //       taille: Math.floor(Math.random() * 40) + 140, // 140-180 cm
  //     })
  //   }
  //   return students
  // }

  // // Handler pour la création massive d'étudiants
  // const handleMassiveCreate = async () => {
  //   // Confirmation avant de lancer la création massive
  //   toast.warning("Génération de +4000 élèves seed?", {
  //     description:'Confirmez ou ignoré tout simplement',
  //     action:{
  //       label:"CONFIRMER",
  //       onClick: async () =>{
  //         const loadingToast = toast.loading('Création massive d\'étudiants en cours...', {
  //           description: 'Génération de 1000 étudiants, veuillez patienter...'
  //         })
      
  //         try {
  //           const testData = generateTestData(4000)
  //           console.log('Début de la création massive de 4k étudiants...')
            
  //           // Créer les étudiants un par un pour éviter les surcharges
  //           for (let i = 0; i < testData.length; i++) {
  //             const student = testData[i]
  //             console.log(`Création de l'étudiant ${i + 1}/4k: ${student.nom_eleve} ${student.post_nom_eleve}`)
              
  //             try {
  //               await createEleve.mutateAsync(student)
                
  //               // Mettre à jour le toast tous les 10 étudiants
  //               if ((i + 1) % 10 === 0) {
  //                 toast.loading(`Création massive d'étudiants en cours...`, {
  //                   description: `${i + 1}/4k étudiants créés...`,
  //                   id: loadingToast
  //                 })
  //               }
  //             } catch (error: any) {
  //               console.error(`Erreur lors de la création de l'étudiant ${i + 1}:`, error)
  //               // Continuer avec les autres étudiants même si l'un échoue
  //             }
              
  //             // Petit délai pour éviter la surcharge
  //             await new Promise(resolve => setTimeout(resolve, 100))
  //           }
            
  //           toast.dismiss(loadingToast)
  //           toast.success('Création massive terminée', {
  //             description: `${testData.length} étudiants ont été ajoutés avec succès.`
  //           })
  //           playSound('success.wav')
  //           refetch()
  //         } catch (error: any) {
  //           toast.dismiss(loadingToast)
  //           toast.error('Erreur lors de la création massive', {
  //             description: error.message || 'Une erreur est survenue pendant la création massive.'
  //           })
  //           playSound('error.wav')
  //         }
  //       }
  //     }
  //   })
  // }






=======
import { Toaster, toast } from 'sonner'

export default function EtudiantPage() {
  const router = useRouter()
  const [me, setMe] = useState('')
  const {anne_Active} = useAnneeStore()
  const {user, hasHydrated} = useAuthStore()
  const {data, isLoading, error} = useDatabaseStatusQuery()
  const { data: students, isLoading: isLoadingStudents, createEleve, updateEleve, deleteEleve } = useEleveVm()

  const goHome = () => {
    router.push('/home')
  }

>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  // Handler pour la création d'étudiant avec toast stylisé
  const handleCreateStudent = async (data: any) => {
    const loadingToast = toast.loading('Création de l\'étudiant en cours...', {
      description: 'Veuillez patienter pendant que nous ajoutons l\'étudiant...'
    })
    
    try {
      const result = await createEleve.mutateAsync(data)
      toast.dismiss(loadingToast)
<<<<<<< HEAD
      toast.success(result.message || 'Ajout réussi', {
        description: `Les informations de ${data.nom_eleve} ${data.post_nom_eleve || ''} ont été ajoutées.`
      })
      playSound('success.wav')
      refetch()
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la création de l\'étudiant', {
        description: 'Veuillez vérifier les informations saisies et réessayer.'
      })
      playSound('error.wav')
=======
      toast.success(result.message || 'Étudiant créé avec succès', {
        description: `L'étudiant ${data.nom_eleve} ${data.post_nom_eleve || ''} a été ajouté avec succès.`,
        action: {
          label: 'Voir',
          onClick: () => console.log('Action de visualisation')
        }
      })
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la création de l\'étudiant', {
        description: 'Veuillez vérifier les informations saisies et réessayer.',
        action: {
          label: 'Réessayer',
          onClick: () => handleCreateStudent(data)
        }
      })
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  }

  // Handler pour la mise à jour d'étudiant avec toast stylisé
  const handleUpdateStudent = async (id: number, data: any) => {
    const loadingToast = toast.loading('Mise à jour en cours...', {
      description: 'Veuillez patienter pendant que nous mettons à jour les informations...'
    })
    
    try {
      const result = await updateEleve.mutateAsync({ id, data })
      toast.dismiss(loadingToast)
      toast.success(result.message || 'Étudiant mis à jour avec succès', {
<<<<<<< HEAD
        description: `Les informations de ${data.nom_eleve} ont été mises à jour avec succès.`
      })
      playSound('success.wav')
      refetch()
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'étudiant', {
        description: 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.'
      })
      playSound('error.wav')
=======
        description: `Les informations de l'étudiant ont été mises à jour avec succès.`,
        action: {
          label: 'Voir',
          onClick: () => console.log('Action de visualisation')
        }
      })
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'étudiant', {
        description: 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.',
        action: {
          label: 'Réessayer',
          onClick: () => handleUpdateStudent(id, data)
        }
      })
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  }

  // Handler pour la suppression d'étudiant avec toast stylisé
  const handleDeleteStudent = async (id: number) => {
    const loadingToast = toast.loading('Suppression en cours...', {
      description: 'Veuillez patienter pendant que nous supprimons l\'étudiant...'
    })
    
    try {
      const result = await deleteEleve.mutateAsync(id)
      toast.dismiss(loadingToast)
<<<<<<< HEAD
      toast.success(result.message || 'Elève supprimé définitivement', {
        description: 'Elève supprimé définitivement de la base de données 👍'
      })
      playSound('UI018.wav')
      refetch()
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error('Erreur lors de la suppression de l\'élève', {
        description: error.message || 'Impossible de supprimer cet élève. Il peut avoir des données associées.',
        action: {
          label: 'Forcer?',
          onClick: () => console.log('Suppression forcer 👉Non implémenté🥱')
=======
      toast.success(result.message || 'Étudiant supprimé avec succès', {
        description: 'L\'étudiant a été supprimé définitivement de la base de données.',
        action: {
          label: 'Annuler',
          onClick: () => console.log('Action d\'annulation (non implémentée)')
        }
      })
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la suppression de l\'étudiant', {
        description: 'Impossible de supprimer cet étudiant. Il peut avoir des données associées.',
        action: {
          label: 'Voir détails',
          onClick: () => console.log('Action de détails')
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        }
      })
    }
  }

  useEffect(() => {
    if (!hasHydrated) return
<<<<<<< HEAD
    if(!user) window.location.href = '/'
=======
    
    if(!user) window.location.href = '/'
    else{
      setMe(user.nom_user)
    }
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  }, [user, hasHydrated])

  if(isLoading || !hasHydrated || isLoadingStudents) return (<LoadingPage size={40}/>)

  // Vérifier si la base de données est initialisée
  if(error || !data?.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <Users className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Base de données non initialisée
              </h2>
              <p className="text-gray-600 mb-4">
                {data?.message || 'Veuillez contacter l\'administrateur pour synchroniser la base de données.'}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ Impossible d'accéder aux données des étudiants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <>
      <Head>
        <title>Lycée Benjamin Escande - Elèves</title>
      </Head>
      <div className="flex h-dvh flex-col overflow-hidden">

      
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Elèves'>
            <Button className='m-1 h-10 w-10 rounded-full hover:cursor-pointer' onClick={()=> router.push("/home")}>
              <LucideHome />
            </Button>
          </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
=======
    <React.Fragment>
      <Head>
        <title>Étudiants - LBE Schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Étudiants'>
          <Button className='m-1 h-10 w-10 rounded-full' onClick={goHome}>
            <ArrowLeftFromLineIcon />
          </Button>
          
        </HeaderComponent>
      </div>
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'>
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-linear-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

            <EleveTable
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              createEleve={handleCreateStudent}
              createEleveMutation={createEleve}
              isUpdatePending={updateEleve.isPending || deleteEleve.isPending}
            />
<<<<<<< HEAD

            {/* PAGINATION DATABASES */}
            <div className='flex items-center gap-2'>
              <div className='bg-muted/50 px-3 py-1 rounded-full text-sm font-medium'>
                {pagination?.totalCount || 0} élève(s)
              </div>
              
              {/* Boutons de pagination */}
              <Button variant='outline' size='sm' 
                onClick={handlePreviousPage}
                disabled={cursor === 0 || isLoadingStudents}
                className='h-10 px-3 -z-1'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              
              <div className='bg-muted/50 px-3 py-1 rounded-full text-sm font-medium'>
                {cursor + 1}-{Math.min(cursor + limit, pagination?.totalCount || 0)} / {pagination?.totalCount || 0}
              </div>
              
              <Button
                variant='outline'
                size='sm'
                onClick={handleNextPage}
                disabled={!pagination?.hasMore || isLoadingStudents}
                className='h-10 px-3 -z-1'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              {/* <Button 
                className='m-1 h-10 px-4 rounded-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm'
                onClick={handleMassiveCreate}
                disabled={isLoadingStudents}
              >
                <Users className='h-4 w-4 mr-2' />
                +4k Élèves
              </Button> */}
            </div>

          </Card>
          <SidebarMotion current='/etudiant'/>
        </main>



      </div>
    </>
=======
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  )
}
