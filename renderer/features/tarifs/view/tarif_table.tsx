"use client"

import React, { useState } from 'react'
import { TarifDataTable } from './tarif_data_table'
import { TarifForm } from './tarif_form'
import { columns } from './tarif_columns'
import { useTarifVm } from '../tarif_VModel'
import { Tarif, CreateTarif, UpdateTarif } from '../tarif_types'
import { Button } from '@/components/ui/button'
import { Calculator, Wallet, CalculatorIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { TitleComponent } from '@/components/layout/title_component'
import Link from 'next/link'


export function TarifTable() {
  const {
    data: tarifs,
    isLoading,
    error,
    createTarif,
    updateTarif,
    deleteTarif,
    refetch
  } = useTarifVm()
  
  const [editingTarif, setEditingTarif] = useState<Tarif | null>(null)
  const handleCreateTarif = async (data: CreateTarif) => {
    try {
      const result = await createTarif.mutateAsync({...data})
      toast.success(result.message || "Tarif créé avec succès")
      refetch()
    } catch (error) {
      toast.error( error.message || "Erreur lors de la création du tarif")
      console.error(error)
    }
  }

  const handleUpdateTarif = async (data: UpdateTarif) => {
    if (!editingTarif) return

    try {
      const result = await updateTarif.mutateAsync({ id: editingTarif.id_tarif, data:{...data} })
      toast.success(result.message || "Tarif mis à jour avec succès")
      setEditingTarif(null)
      refetch()
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour du tarif")
      console.error(error)
    }
  }

  const handleDeleteTarif = async (tarif: Tarif) => {
    try {
      await deleteTarif.mutateAsync(tarif.id_tarif)
      toast.success("Tarif supprimé avec succès")
      refetch()
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression du tarif")
      console.error(error)
    }
  }

  const handleEditTarif = (tarif: Tarif) => {
    setEditingTarif(tarif)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <Calculator className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
            <p className="text-sm mt-2">
              Une erreur est survenue lors du chargement des tarifs.
              {error.message}
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
          <TitleComponent Icon={CalculatorIcon}>
            <div className='flex-1'>
              <p className='text-lg font-bold'>Gestion des Tarifs</p>
              <p>Définissez les tarifs par classe, année scolaire et type de frais</p>
            
            </div>
            <Link href={"/frais"}>
              <Button><Wallet/>Frais & scolarite</Button>
            </Link>
          </TitleComponent>
      

      <TarifDataTable
        columns={columns}
        data={tarifs||[]}
        onCreateTarif={handleCreateTarif}
        onEditTarif={handleEditTarif}
        onDeleteTarif={handleDeleteTarif}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      <TarifForm
        trigger={<div />} // Hidden trigger since we control it programmatically
        onSubmit={handleUpdateTarif}
        isOpen={!!editingTarif}
        close={()=>setEditingTarif(null)}
        tarif={editingTarif}
        isLoading={updateTarif.isPending}
        title="Modifier le tarif"
        description="Modifiez les informations du tarif."
        submitButtonText="Mettre à jour"
      />
    </div>
  )
}
