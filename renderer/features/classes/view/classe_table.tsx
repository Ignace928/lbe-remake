"use client"

import React, { useState } from 'react'
import { ClasseDataTable } from './classe_data_table'
import { ClasseForm } from './classe_form'
import { columns } from './classe_columns'
import { useClasseVm } from '../classe_VModel'
import { Classe, CreateClasse, UpdateClasse } from '../classe_types'
import { Button } from '@/components/ui/button'
import { BookMarkedIcon, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent} from '@/components/ui/card'
import {motion} from 'framer-motion'
import { useRouter } from 'next/router'
import { playSound } from '@/lib/soundSystem'
import { TitleComponent } from '@/components/layout/title_component'
import { ScrollArea } from '@/components/ui/scroll-area'



export function ClasseTable() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingClasse, setEditingClasse] = useState<Classe | null>(null)

  const {
    data: classes,
    isLoading,
    error,
    createClasse,
    updateClasse,
    deleteClasse,
    refetch
  } = useClasseVm()

  const handleAddClasse = () => {
    setShowAddForm(true)
  }

  const handleCreateClasse = async (data: CreateClasse) => {
    try {
      await createClasse.mutateAsync(data)
      toast.success("Classe créée avec succès")
      setShowAddForm(false)
      refetch()
    } catch (error) {
      toast.error("Erreur lors de la création de la classe")
      console.error(error)
    }
  }

  
  const handleUpdateClasse = async (data: UpdateClasse) => {
    if (!editingClasse) return
    console.log(editingClasse)

    try {
      await updateClasse.mutateAsync({ id: editingClasse.id_classe, data })
      toast.success("Classe mise à jour avec succès")
      setEditingClasse(null)
      refetch()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la classe")
      console.error(error)
    }
  }

  const handleDeleteClasse = async (classe: Classe) => {
    const loadingToast = toast.loading('Suppression en cours...', {
      description: 'Veuillez patienter pendant que nous supprimons la classe...'
    })
    try {
      const result = await deleteClasse.mutateAsync(classe.id_classe)
      toast.dismiss(loadingToast)
      toast.success(result.message || 'Classe supprimée avec succès', {
        description: 'Classe supprimé définitivement de la base de données 👍'
      })
      refetch()
      playSound('UI018.wav')
    } catch (error:any) {
      toast.dismiss(loadingToast)
      toast.error("Erreur de la suppression",{
        description: error.message || 'Il peut avoir des données associées',
      })
    }
  }

  const handleEditClasse = (classe: Classe) => {
    setEditingClasse(classe)
  }

  if (error) {
    console.log(error)
    return (
      <div className="flex items-center justify-center min-h-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-sm mt-2 text-muted-foreground">
                Une erreur est survenue lors du chargement des classes.
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScrollArea className="min-h-0 flex flex-col h-full">
        <TitleComponent Icon={BookMarkedIcon}>
          <div className='flex-1'>
            <p className='text-lg font-bold text-foreground'>
              {
                editingClasse ? (`${editingClasse.nom_classe}`) : showAddForm ? "Ajouter une nouvelle classe" : "Gestion des Niveaux" 
              }
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              👉  {
                    editingClasse ? (`${editingClasse.niveau} - ${editingClasse.titulaire || 'Sans titulaire'}`) : showAddForm ? ('Les champs * sont requis') : 
                      `sur ${(classes || []).length} classe${(classes || []).length > 1 ? 's' : ''} enregistrée${(classes || []).length > 1 ? 's' : ''}` 
                    
                  }
            </p>
          </div>
        </TitleComponent>

      {/* Tableau des classes */}
        <ClasseDataTable
          className="min-h-0 flex-1"
          columns={columns}
          data={classes || []}
          onEditClasse={handleEditClasse}
          onDeleteClasse={handleDeleteClasse}
          onAddClasse={handleAddClasse}
          isLoading={isLoading}
        />
      {
        editingClasse ? (
              <ClasseForm
                showform={true}
                hiddeform={() => setEditingClasse(null)}
                trigger={<div />}
                onSubmit={handleUpdateClasse}
                classe={editingClasse}
                isLoading={updateClasse.isPending}
                title=""
                description=""
                submitButtonText="Mettre à jour"
              />
        ) : showAddForm ? (
              <ClasseForm
                showform={true}
                hiddeform={() => setShowAddForm(false)}
                trigger={<div />}
                onSubmit={handleCreateClasse}
                isLoading={createClasse.isPending}
                title=""
                description=""
                submitButtonText="Créer la classe"
              />
        ) : ("")
      }
    </ScrollArea>
  )
}
