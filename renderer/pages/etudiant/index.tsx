import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useAnneeStore } from '@/store/anneStore'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import { useEleveVm } from '@/features/eleves/eleve_VModel'
import { EleveTable } from '@/features/eleves/view/eleve_table'
import LoadingPage from '@/components/loadingPage'

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

  useEffect(() => {
    if (!hasHydrated) return
    
    if(!user) window.location.href = '/'
    else{
      setMe(user.nom_user)
    }
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
            

            <EleveTable
              students={students}
              onUpdateStudent={async (id, data) => {
                await updateEleve.mutateAsync({ id, data })
              }}
              onDeleteStudent={async (id) => {
                await deleteEleve.mutateAsync(id)
              }}
              createEleve={createEleve}
              isUpdatePending={updateEleve.isPending || deleteEleve.isPending}
            />
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
