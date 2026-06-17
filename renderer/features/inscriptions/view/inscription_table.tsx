"use client"

import React, { useEffect, useState } from "react"
import {
  useInscriptionStore,
  useIsInscriptionDetailOpen,
  useSelectedInscription,
} from "@/store/inscriptionStore"
import { InscriptionDataTable } from "./inscription_data_table"
import { columns } from "./inscription_columns"
import { useInscriptionVm } from "../inscription_VModel"
import { Inscription, UpdateInscription } from "../inscription_types"
import { Button } from "@/components/ui/button"
import { Loader2, PenBoxIcon, Plus, Users } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { playSound } from "@/lib/soundSystem"
import { InscriptionDetails } from "./inscriptionDetails"
import { InscriptionForm } from "./inscription_form"
import { Classe } from "@/features/classes/classe_types"

interface InscriptionTableWrapperProps {
  id_anne: string
  id_classe: number
  classe: Classe
  onClasseUpdated?: (classe: Classe) => void
}

function toUpdatePayload(inscription: Inscription): UpdateInscription {
  return {
    id_inscription: inscription.id_inscription,
    id_classe: inscription.id_classe,
    id_eleve: inscription.id_eleve,
    id_annee: inscription.id_annee,
    somme: inscription.somme,
    passant: inscription.passant,
  }
}

export function InscriptionTable({
  id_anne,
  id_classe,
  classe,
  onClasseUpdated,
}: InscriptionTableWrapperProps) {
  const {
    data: inscriptions,
    isLoading,
    error,
    deleteInscription,
    refetch,
  } = useInscriptionVm({ id_anne, id_classe })
  const select = useInscriptionStore((state) => state.select)
  const clear = useInscriptionStore((state) => state.clear)
  const selected = useSelectedInscription()
  const isViewingDetails = useIsInscriptionDetailOpen()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    clear()
    refetch()
    setShowForm(false)
  }, [id_classe, clear])

  const handleDeleteInscription = async (inscription: Inscription) => {
    const loadingToast = toast.loading("Suppression en cours...", {
      description:
        "Veuillez patienter pendant que nous supprimons l'inscription...",
    })
    try {
      const result = await deleteInscription.mutateAsync(
        inscription.id_inscription
      )
      toast.dismiss(loadingToast)
      toast.success(result.message || "Inscription supprimée avec succès", {
        description:
          "Inscription supprimé définitivement de la base de données 👍",
      })
      playSound("UI018.wav")
      if (selected?.id_inscription === inscription.id_inscription) {
        clear()
      }
      refetch()
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      const message =
        error instanceof Error
          ? error.message
          : "Il peut avoir des données associées"
      toast.error("Erreur lors de la suppression de l'inscription", {
        description: message,
      })
    }
  }

  const showInscriptionDetail = (inscription: Inscription) => {
    select(inscription)
    setShowForm(false)
  }

  const inscriptionForm = (
    <InscriptionForm
      idClasse={id_classe}
      inscription={selected ? toUpdatePayload(selected) : null}
      open={showForm}
      close={() => setShowForm(false)}
      trigger={
        <Button onClick={() => setShowForm(true)}>
          {selected ? (
            <>
              <PenBoxIcon className="mr-2 h-4 w-4" />
              Modifier
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle inscription
            </>
          )}
        </Button>
      }
    />
  )

  if (error) {
    return (
      <Card className="border-none bg-linear-to-br from-card via-card to-muted/30 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <Users className="mx-auto mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
            <p className="mt-2 text-sm">
              Une erreur est survenue lors du chargement des inscriptions.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {isViewingDetails ? (
          <InscriptionDetails
            classe={classe}
            onClasseUpdated={onClasseUpdated}
          />
      ) : (
          <InscriptionDataTable
            columns={columns}
            data={
              Array.isArray(inscriptions)
                ? inscriptions
                : inscriptions?.rows || []
            }
            onDeleteInscription={handleDeleteInscription}
            describeInscription={showInscriptionDetail}
            isLoading={isLoading}
            headerActions={inscriptionForm}
            classe={classe}
            onClasseUpdated={onClasseUpdated}
          />
      )}
    </div>
  )
}
