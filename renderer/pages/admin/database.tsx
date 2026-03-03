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
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'> {/* Offset pour le header fixe */}
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
            <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            {/* Header et statut combinés */}
            <div className='mb-6'>
              <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 transition-all duration-300 ${
                !selectedDatabase 
                  ? 'border-destructive/50' 
                  : isInitialized 
                    ? 'border-green-500/50' 
                    : 'border-yellow-500/50'
              }`}>
                <div className={`rounded-full p-3 shadow-lg transition-all duration-300 ${
                  !selectedDatabase 
                    ? 'bg-gradient-to-r from-destructive to-destructive/80' 
                    : isInitialized 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                }`}>
                  <Database className={`h-6 w-6 text-white transition-all duration-300 ${
                    !selectedDatabase 
                      ? 'animate-pulse' 
                      : isInitialized 
                        ? '' 
                        : 'animate-pulse'
                  }`} />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Source de données actuelle</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {selectedDatabase 
                      ? `👉 ${selectedDatabase.name}` 
                      : 'Aucune source de données sélectionnée'
                    }
                  </p>
                  <div className='mt-4 flex justify-end'>
                </div>
                <span className='flex flex-row gap-2 items-center justify-start text-sm text-muted-foreground'>
                <div className={`h-3 w-3 rounded-full shadow-lg ${!selectedDatabase ? 'hidden' : isInitialized ? 'bg-gradient-to-r from-green-400 to-green-600 animate-pulse' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'}`} />
                  <p>
                    {
                      !selectedDatabase 
                      ? 'Aucune base de données connectée' 
                      : isInitialized 
                      ? 'Base de données prête et synchronisée' 
                      : 'Base de données nécessite une synchronisation'
                    }
                  </p>
                </span>
              </div>
              
              {/* Compteur compact */}
              
                    <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                      {databases?.length || 0} base{(databases?.length || 0) > 1 ? 's' : ''} disponible{(databases?.length || 0) > 1 ? 's' : ''}
                    </span>
                  </div>
            </div>

            {/* Section de gestion compacte */}
            <div className='mb-6'>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <div className='rounded-full bg-gradient-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
                      <Database className='h-4 w-4 text-primary-foreground' />
                    </div>
                  </div>
                  <Input
                    className='pl-12 border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                    placeholder='📝 nom-du-fichier.db'
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateDatabase} 
                  disabled={isLoading || fileName.trim().length === 0} 
                  className='w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-2 border-primary/70 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 font-bold'
                >
                  <Database className='mr-2 h-4 w-4' />
                  {isLoading ? '⏳ Création...' : '✨ Créer'}
                </Button>
                <Button 
                  onClick={handleSyncDatabase} 
                  disabled={isSyncing || isInitialized}
                  variant='secondary' 
                  className={`w-full sm:w-auto transition-all duration-200 hover:scale-105 font-bold ${
                    !selectedDatabase 
                      ? 'hidden opacity-50 cursor-not-allowed' 
                      : isInitialized 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-2 border-green-700 shadow-lg shadow-green-500/30 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-2 border-yellow-700 shadow-lg shadow-yellow-500/30 cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isInitialized ? "✅ Terminé" : isSyncing ? '🔄 Sync...' : '🔄 Sync'}
                </Button>
              </div>
              
              {/* Message d'état compact */}
              <div className='mt-4 text-center'>
                
              </div>
            </div>
              
              {/* Section fichiers optimisée */}
              <div className='flex-1 overflow-hidden'>
                <div className='h-full p-4 rounded-2xl bg-gradient-to-br from-muted/20 to-card border-2 border-dashed border-primary/30'>
                  <div className='text-center'>
                    <p className='text-xs text-muted-foreground'>Créez et gérez vos sources de données</p>
                  </div>
                  <div className='h-full overflow-hidden'>
                    <CreateTextFileComponent/>
                  </div>
                </div>
              </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
