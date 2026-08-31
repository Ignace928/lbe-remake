"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from '@/components/ui/badge'
import { classesWithMatricules } from '../classe_types'
import { EleveInfoCell } from './eleve_info_cell'
 
// This type is used to define the shape of our data.
export type ClasseTableData = classesWithMatricules
 
export const columns: ColumnDef<ClasseTableData>[] = [
  {
    accessorKey: "nom_classe",
    header: "Classe",
    cell: ({ row }) => {
      const classe = row.original
      return (
        <div>
          <span className="font-medium">{classe.nom_classe || 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "niveau",
    header: "Niveau",
    cell: ({ row }) => {
      const classe = row.original
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          {classe.niveau || 'N/A'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "titulaire",
    header: "Titulaire",
    cell: ({ row }) => {
      const classe = row.original
      return (
        <span className="text-sm">{classe.titulaire || '-'}</span>
      )
    },
  },
  {
    id: "delegue1",
    header: "Délégué 1",
    cell: ({ row }) => {
      
      return <p>{row.original.delegue_1_matricule}</p>
    },
  },
  {
    id: "delegue2",
    header: "Délégué 2",
    cell: ({ row }) => {
      
      return <p>{row.original.delegue_2_matricule}</p>
    },
  },
  {
    id: "meilleurEleve",
    header: "Meilleur élève",
    cell: ({ row }) => {
      return <p>{row.original.meilleur_eleve_matricule}</p>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const classe = row.original
      // These will be passed as props to the DataTable component
      return null // Actions will be handled in the parent component
    },
  },
]
