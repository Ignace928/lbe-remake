"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from '@/components/ui/badge'
import { allTarifSingleType, Tarif } from '../tarif_types'
import { CheckboxItem } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui"
 
// This type is used to define the shape of our data.
export type TarifTableData = allTarifSingleType
 
const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('MGA', {
    minimumFractionDigits: 0,
    
  }).format(montant)
}

 
export const columns: ColumnDef<TarifTableData>[] = [
  {
    accessorKey: "id_classe",
    header: "ID Classe",
    cell: ({ row }) => {
      const classe = row.original.classe
      return (
        <Badge variant="outline">
          {classe?.nom_classe}
        </Badge>
      )
    },
  },
  {
    accessorKey: "id_type_frais",
    header: "ID Type Frais",
    cell: ({ row }) => {
      const typeFrais = row.original.typeFrais
      return (
        <Badge variant="outline">
          {typeFrais?.libelle}
        </Badge>
      )
    },
  },
  {
    accessorKey: "montant_fixe",
    header: "Montant fixe",
    cell: ({ row }) => {
      const tarif = row.original
      return (
        <span className="font-semibold ">
          {formatMontant(tarif?.montant_fixe)} Ar
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const tarif = row.original
      // These will be passed as props to the DataTable component
      return null // Actions will be handled in the parent component
    },
  },
]
