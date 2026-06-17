"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { PenBoxIcon } from 'lucide-react'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { Badge } from '@/components/ui/badge'
import { Inscription } from '../inscription_types'
 
// This type is used to define the shape of our data.
export type InscriptionTableData = Inscription
 
const getPassantBadge = (passant: boolean) => {
  return passant ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
      Passant
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
      Non passant
    </Badge>
  )
}
 
export const columns: ColumnDef<InscriptionTableData>[] = [
  {
    accessorKey: "eleve",
    header: "Élève",
    cell: ({ row }) => {
      const inscription = row.original
      const eleve = inscription.eleve
      
      return (
        <div>
          <span className="font-medium">
            {eleve ? `${eleve.nom_eleve} ${eleve.post_nom_eleve || ''}` : `ID: ${inscription.id_eleve}`}
          </span>
          {eleve && (
            <div className="text-sm text-muted-foreground">
              Mat: {eleve.matricule}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "anneeScolaire",
    header: "Année scolaire",
    cell: ({ row }) => {
      const inscription = row.original
      const anneeScolaire = inscription.anneeScolaire
      
      return (
        <Badge variant="outline">
          {anneeScolaire ? anneeScolaire.libelle : inscription.id_annee}
        </Badge>
      )
    },
  },
  {
    accessorKey: "passant",
    header: "Statut",
    cell: ({ row }) => {
      const inscription = row.original
      
      return getPassantBadge(inscription.passant)
    },
  },
]
