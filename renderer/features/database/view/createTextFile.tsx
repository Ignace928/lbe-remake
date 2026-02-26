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
    <div className='mt-4'>      
      {/* Affichage de la BDD sélectionnée */}
      
      
      <div className='mt-4'>
        <div className='flex flex-row items-center gap-2'>
          <FileSearch2 className='text-amber-50'/>
          <Input 
            className='w-1/2 border-white/20 bg-slate-900/50 text-slate-100 placeholder:text-slate-400'
            placeholder='Chercher une base de données existant'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        
        {filteredDatabases.length === 0 ? (
          <div className='mt-2 overflow-hidden flex items-center justify-center text-center rounded-md border border-white/10 bg-slate-950/35'>
            <ScrollArea className='h-50 p-2 w-full '>
              <p className='text-sm text-slate-300'>Aucune base de données trouvée 😥</p>
            </ScrollArea>
          </div>
        ) : (
          <div className='mt-2 overflow-hidden rounded-md border border-white/10 bg-slate-950/35'>
            <ScrollArea className='h-50 p-2 w-full'>
              <Table className='rounded-2xl'>
                <TableHeader>
                  <TableRow className='border-white/10 bg-[#252324] hover:bg-[#2523248f]'>
                    <TableHead className='text-slate-300'>Source</TableHead>
                    <TableHead className='text-slate-300'>Activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDatabases.map((file) => (
                    <TableRow key={file.path} className='rounded-md border text-slate-300 hover:bg-[#2523248f] border-white/10 bg-slate-900/50 px-2 py-1'>
                      <TableCell>{file.name}</TableCell>
                      <TableCell className='flex flex-cols items-center gap-6'>
                        <Switch 
                          checked={selectedDb?.path === file.path}
                          onCheckedChange={() => selectedDb?.path === file.path ? handleClearSelection() : handleSelectDatabase(file)}
                          disabled={isReconnecting}
                        />
                        
                        <ModalHandleDelete
                            personalization='w-10 h-10 m-1 rounded-b-full rounded-t-full cursor-pointer'
                            btnVariant='default'
                            state={false}
                            title={`Suppression definitive de ${file.name}`}
                            description='Cette action est irréversible! Voulez-vous continuer?'
                            onConfirm={() => handleDeleteDatabase(file)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
