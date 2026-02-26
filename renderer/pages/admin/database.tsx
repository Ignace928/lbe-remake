import React, { useState } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon, Database, RefreshCw } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateTextFileComponent } from '@/features/database/view/createTextFile'
import { useCreateDatabaseMutation, useDatabaseListQuery, useDatabaseState, useSyncDatabaseMutation } from '@/features/database/database_VModel'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

export default function dataBasesPage() {
  
  const [fileName, setFileName] = useState('')
  const { isInitialized, selectedDatabase, databases } = useDatabaseState()
  const {isLoading: isLinstening} = useDatabaseListQuery()
  
  const syncMutation = useSyncDatabaseMutation()
  const createMutation = useCreateDatabaseMutation()
  
  const isLoading = createMutation.isPending
  const isSyncing = syncMutation.isPending

  // Créer une base de données
    const handleCreateDatabase = async () => {
      if (!fileName.trim()) return
  
      try {
        await createMutation.mutateAsync(fileName)
        toast.success('Base de données créée avec succès', {
          description: fileName,
        })
        setFileName('')
      } catch (error) {
        toast.error('Échec de la création', {
          description: error instanceof Error ? error.message : 'Erreur inconnue',
        })
      }
    }

  // Synchroniser la base de données
  const handleSyncDatabase = async () => {
    try {
      const result = await syncMutation.mutateAsync()
      
      if (result.success) {
        toast.success('Base de données synchronisée', {
          description: `Tables créées/mises à jour dans ${result.database}`,
        })
      } else {
        toast.error('Erreur de synchronisation', {
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Erreur lors de la synchronisation', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }
  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/admin'
  }

  return (
    <React.Fragment>
      <Head>
        <title>Source de données - LBE-schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Source de données'>
          <Button className='w-10 h-10 m-1 rounded-full' onClick={goHome}>
            <ArrowLeftFromLineIcon />
          </Button>
        </HeaderComponent>
      </div>
      <div className='app-page'>
        <ScrollArea className='h-full border border-lime-500/50 rounded-2xl p-2'>
          <Card className='border-white/15 bg-white/10 h-full p-4 backdrop-blur-sm sm:p-5'>
            {/* Header avec statut de la source de données */}
            {/* Indicateur de statut */}
                  <div className='mt-4 flex items-center gap-2'>
                    <div className={`h-2 w-2 rounded-full ${!selectedDatabase ? 'hidden' : isInitialized ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className='text-sm text-slate-300'>
                      {!selectedDatabase ? "" : isInitialized ? 'Base de données initialisée' : 'Base de données Asynchronisé'}
                    </span>
                    <span className="text-md text-lime-500 ml-auto">
                      {databases?.length || 0} base{(databases?.length || 0) > 1 ? 's' : ''} disponible{(databases?.length || 0) > 1 ? 's' : ''}
                    </span>
                  </div>

            <div className={`mt-4 rounded-md border p-3 ${!selectedDatabase ? 'border-red-500/50 bg-[crimson]/30' : isInitialized ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-amber-500/30 bg-amber-950/20'}`}>
              <div className='flex items-center gap-3'>
                <div className='mb-6'>
                  <div className='flex items-center gap-3'>
                    <Database className={`h-5 w-5 ${!selectedDatabase ? 'text-red-500' : isInitialized ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <div>
                      <p className='text-lg font-semibold text-white'>Source de données actuelle</p>
                      <p className='mt-1 text-lg text-bold text-slate-300'>
                        {selectedDatabase 
                          ? `👉${selectedDatabase.name}` 
                          : 'Aucune source de données sélectionnée'
                        }
                      </p>
                    </div>
                  </div>
                  
                  
                </div>

              </div>
            </div>

            {/* Composant principal de gestion */}
            <div className='border-t border-white/10 pt-4'>
            <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sticky-2'>
                    <Input
                      className='border-white/20 bg-slate-900/50 text-slate-100 placeholder:text-slate-400'
                      placeholder='nom-du-fichier'
                      value={fileName}
                      onChange={(event) => setFileName(event.target.value)}
                    />
                    <Button 
                      onClick={handleCreateDatabase} 
                      disabled={isLoading || fileName.trim().length === 0} 
                      className='w-full sm:w-auto cursor-pointer'
                    >
                      {isLoading ? 'Creation...' : 'Creer source'}
                    </Button>
                    <Button 
                      onClick={handleSyncDatabase} 
                      disabled={isSyncing || isInitialized}
                      variant='secondary' 
                      className={`w-full sm:w-auto ${!selectedDatabase ? 'hidden': isInitialized ? 'bg-emerald-500' : 'bg-amber-500 cursor-pointer '}`}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isInitialized ? "" :  isSyncing ? 'Synchronisation...' : 'Sync'}
                    </Button>
                  </div>
                  
              <CreateTextFileComponent/>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
