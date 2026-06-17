"use client"

import React, { useState } from 'react'
import { TypeFraisDataTable } from './typeFrais_data_table'
import { TypeFraisForm } from './typeFrais_form'
import { columns } from './typeFrais_columns'
import { useTypeFraisVm } from '../typeFrais_VModel'
import { TypeFrais, CreateTypeFrais, UpdateTypeFrais } from '../typeFrais_types'
import { Button } from '@/components/ui/button'
import { DollarSign, Wallet, Calculator } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { TitleComponent } from '@/components/layout/title_component'
import { useRouter } from 'next/router'

export function TypeFraisTable() {
  const router = useRouter()
  const {
    data: typeFrais,
    isLoading,
    error,
    deleteTypeFrais,
    createTypeFrais,
    updateTypeFrais,
    refetch
  } = useTypeFraisVm()

  const [editingTypeFrais, setEditingTypeFrais] = useState<TypeFrais | null>(null)

  const handleCreateTypeFrais = async (data: CreateTypeFrais) => {
      try {
        const result = await createTypeFrais.mutateAsync(data)
        toast.success(result.message || "Type de frais créé avec succès")
      } catch (error) {
        toast.error("Erreur d'ajout de type de frais",{
          description: error.message || 'Soit une erreur de base de donné soit erreur metier',
        })
      }
    }
  
    const handleUpdateTypeFrais = async (data: UpdateTypeFrais) => {
      if(!editingTypeFrais)return
      try {
        const result = await updateTypeFrais.mutateAsync({ id: editingTypeFrais.id_type_frais, data })
        toast.success(result.message || "Type de frais mis à jour avec succès")
      } catch (error) {
        toast.error("Erreur lors de la mise à jour",{
          description: error.message || 'Soit une erreur de base de donné soit erreur metier',
        })
      }
    }

  const handleDeleteTypeFrais = async (typeFrais: TypeFrais) => {
    try {
      await deleteTypeFrais.mutateAsync(typeFrais.id_type_frais)
      toast.success("Type de frais supprimé avec succès")
      refetch()
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression du type de frais")
    }
  }

  const handleEditTypeFrais = (typeFrais: TypeFrais) => {
    setEditingTypeFrais(typeFrais)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <DollarSign className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
            <p className="text-sm mt-2">
              Une erreur est survenue lors du chargement des types de frais.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-0 flex flex-col h-full">
      <TitleComponent Icon={Wallet}>
        <div className='flex-1'>
          <p className='text-lg font-bold'>Gestion des frais</p>
          <p>Les types de frais</p>
        </div>
          <Button onClick={()=>router.push("frais/tarifs")}><Calculator/>Gestion des Tarifs</Button>
      </TitleComponent>

      <TypeFraisDataTable
        columns={columns}
        data={typeFrais || []}
        onEditTypeFrais={handleEditTypeFrais}
        Delete={handleDeleteTypeFrais}
        AddNew={handleCreateTypeFrais}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      {
        editingTypeFrais && <TypeFraisForm
          trigger={<div/>}
          showform={true}
          hiddeform={()=>setEditingTypeFrais(null)}
          typeFrais={editingTypeFrais}
          onSubmit={handleUpdateTypeFrais}
          isLoading={updateTypeFrais.isPending}
          submitButtonText='Modifier'
        />
      }
    </div>
  )
}
