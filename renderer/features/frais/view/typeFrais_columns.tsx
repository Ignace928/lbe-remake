"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { TypeFrais } from '../typeFrais_types'
import { Badge } from "@/components/ui/badge"
 
// This type is used to define the shape of our data.
export type TypeFraisTableData = TypeFrais
 
export const columns: ColumnDef<TypeFraisTableData>[] = [
  {
    accessorKey: "libelle",
    header: "Libellé",
    cell: ({ row }) => {
      const typeFrais = row.original
      return (
        <div>
          <span className="font-medium">{typeFrais.libelle}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "detail",
    header: "Détails",
    cell: ({ row }) => {
      const typeFrais = row.original
      return (
        <span className="text-sm text-muted-foreground">
          {typeFrais.detail || 'Aucun détail'}
        </span>
      )
    },
  },
  {
    accessorKey: "freq",
    header: "Occurence",
    cell: ({ row }) => {
      const typeFrais = row.original
      return (
        <Badge variant="outline">
          {typeFrais.freq || 'Aucun détail'}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const typeFrais = row.original
      // These will be passed as props to the DataTable component
      return null // Actions will be handled in the parent component
    },
  },
]
