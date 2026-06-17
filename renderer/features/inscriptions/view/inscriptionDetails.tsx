import React, { useEffect, useState } from "react"
import { useSelectedInscription } from "@/store/inscriptionStore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, ChefHat, ChessKnight, ChessRook, Crown, GraduationCap, PenBoxIcon, TrophyIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { InscriptionCertificateSection } from "./certificat"
import { InscriptionForm } from "./inscription_form"
import { Inscription, UpdateInscription } from "../inscription_types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SummaryStudent } from "@/components/classe/SummaryStudent"
import { Classe } from "@/features/classes/classe_types"

// const formatMontant = (montant: number) =>
//   new Intl.NumberFormat("fr-FR", {
//     style: "currency",
//     currency: "XOF",
//     minimumFractionDigits: 0,
//   }).format(montant)

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


interface InscriptionDetailsProps {
  className?: string
  classe: Classe
  onClasseUpdated?: (classe: Classe) => void
}

export function InscriptionDetails({
  classe,
  onClasseUpdated,
}: InscriptionDetailsProps) {
  const inscription = useSelectedInscription()
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    setShowEditForm(false)
  }, [inscription?.id_inscription])

  if (!inscription) return null

  const { eleve } = inscription

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-none bg-linear-to-br from-card via-card to-muted/30 shadow-xl shadow-primary/5">
      <CardContent className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-primary/10 pb-4">
          <InscriptionForm
            idClasse={inscription.id_classe}
            inscription={toUpdatePayload(inscription)}
            open={showEditForm}
            close={() => setShowEditForm(false)}
            trigger={
              <Button
                className="rounded"
                onClick={() => setShowEditForm(true)}
              >
                <PenBoxIcon className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            }
          />
        </div>
        <div className='h-full grid grid-cols-3'>
          <ScrollArea className="col-span-2 grid h-full w-full pr-6">
            <InscriptionCertificateSection inscription={inscription} />
          </ScrollArea>
          <div className="flex h-full w-full flex-col items-center gap-4 bg-re">
            <p className="text-center text-sm font-medium text-foreground">
              Rôles dans {classe.nom_classe}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              {eleve
                ? `${eleve.nom_eleve} ${eleve.post_nom_eleve ?? ""}`.trim()
                : `Élève #${inscription.id_eleve}`}
            </p>
            <SummaryStudent
              classe={classe}
              eleveId={inscription.id_eleve}
              onClasseUpdated={onClasseUpdated}
            />
            <div className="space-y-2 text-center text-xs text-muted-foreground">
              <p className="flex flex-row gap-2 items-center">
                <ChefHat size={20}/> délégué 1
              </p>

              <p className="flex flex-row gap-2 items-center">
                <ChessKnight size={20}/> délégué 2
              </p>

              <p className="flex flex-row gap-2 items-center">
                <Award size={20}/> Meilleur élève
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function getInscriptionFullName(inscription: Inscription) {
  const { eleve } = inscription
  return eleve
    ? `${eleve.nom_eleve} ${eleve.post_nom_eleve ?? ""}`.trim()
    : `Élève #${inscription.id_eleve}`
}
