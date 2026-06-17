import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Switch } from '../../../components/ui/switch'
import { FileSearch2 } from 'lucide-react'
import ModalHandleDelete from '../../../components/ModalHandleDelete'
import {
  useDatabaseListQuery,
  useCreateDatabaseMutation,
  useDeleteDatabaseMutation,
  useSyncDatabaseMutation,
  useSelectedDatabaseQuery,
  useSelectDatabaseMutation,
  useClearSelectedDatabaseMutation,
  useReconnectDatabaseMutation
} from '@/features/database/database_VModel'
import { DatabaseFile } from '@/features/database/database_types'

export function CreateTextFileComponent() {
  // États locaux
  const [search, setSearch] = useState('')

  // Hooks pour les opérations de base de données
  const { data: databases } = useDatabaseListQuery()
  const { data: selectedDb } = useSelectedDatabaseQuery()
  
  
  const deleteMutation = useDeleteDatabaseMutation()
  const selectMutation = useSelectDatabaseMutation()
  const clearMutation = useClearSelectedDatabaseMutation()
  const reconnectMutation = useReconnectDatabaseMutation()

  // États de chargement combinés
  const isReconnecting = reconnectMutation.isPending

  // Filtrer les bases de données
  const filteredDatabases = useMemo(() => {
    if (!databases) return []
    
    return databases.filter((item) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q)
      return matchesSearch
    })
  }, [databases, search])

  

  // Supprimer une base de données
  const handleDeleteDatabase = async (file: DatabaseFile) => {
    try {
      const result = await deleteMutation.mutateAsync(file.path)
      if (result.success) {
        toast.success(`${file.name} supprimée avec succès`)
      } else {
        toast.error('Échec de la suppression', {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }

  // Sélectionner une base de données
  const handleSelectDatabase = async (file: DatabaseFile) => {
    try {
      // D'abord mettre à jour le fichier de configuration
      await selectMutation.mutateAsync(file)
      
      // Ensuite reconnecter Sequelize avec la nouvelle base de données
      const result = await reconnectMutation.mutateAsync(file.name)
      
      if (result.success) {
        toast.success('Base de données changée avec succès', {
          description: `${file.name} est maintenant la source active et reconnectée`,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error('Erreur lors du changement de base de données', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }

  // Effacer la sélection
  const handleClearSelection = async () => {
    try {
      await clearMutation.mutateAsync()
      toast.success('Sélection effacée')
    } catch (error) {
      toast.error('Erreur lors de l\'effacement', {
        description: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }

  

  return (
    <div className='h-full p-4 rounded-2xl bg-linear-to-br from-muted/20 to-card border-2 border-dashed border-primary/30'>
      <div className='text-center'>
        <p className='text-xs text-muted-foreground p-2'>Créez et gérez vos sources de données</p>
        <div className='flex flex-row items-center gap-2 sticky'>
          <div className='rounded-full bg-linear-to-r from-primary to-secondary p-2 shadow-lg shadow-primary/20'>
            <FileSearch2 className='h-4 w-4 text-primary-foreground'/>
          </div>
          <Input 
            className='flex-1 border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
            placeholder='🔍 Chercher une base de données existante...'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(65vh-250px)] border-none p-3">
        <div className='mt-4'>      
          {/* Affichage de la BDD sélectionnée */}
                
          <div className='mt-4'>
            
            {filteredDatabases.length === 0 ? (
              <div className='mt-2 text-center py-8'>
                <div className='text-4xl mb-2'>🔍</div>
                <p className='text-sm text-muted-foreground'>Aucune base de données trouvée 😥</p>
              </div>
            ) : (
              <div className='mt-2 space-y-2'>
                {filteredDatabases.map((file) => (
                  <div key={file.path} className='flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors duration-200'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-primary/10 p-2'>
                        <FileSearch2 className='h-4 w-4 text-primary' />
                      </div>
                      <span className='font-medium text-foreground'>{file.name}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Switch 
                        checked={selectedDb?.path === file.path}
                        onCheckedChange={() => selectedDb?.path === file.path ? handleClearSelection() : handleSelectDatabase(file)}
                        disabled={isReconnecting}
                      />
                      <ModalHandleDelete
                          personalization='h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90 transition-colors duration-200'
                          btnVariant='destructive'
                          state={false}
                          title={`Suppression definitive de ${file.name}`}
                          description='Cette action est irréversible! Voulez-vous continuer?'
                          onConfirm={() => handleDeleteDatabase(file)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
    
  )
}
