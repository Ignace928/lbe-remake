"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from '@/components/ui/badge'
import { Eleve } from '../eleve_types'
 
// This type is used to define the shape of our data.
export type EleveTableData = Eleve & { created_at: Date }
export { getStatusBadge, getSexeBadge }
 
// Helper functions
// const Matricule = (eleve: EleveTableData) => {
//   const id = eleve.id_eleve
//   const sexe = eleve.sexe
//   const currentYear = new Date(eleve.created_at).getFullYear()
//   const yearCode = currentYear - 2000 // 24 pour 2024
  
//   if (id && sexe) {
//     const sexeCode = sexe === 'F' ? 'F' : 'M'
//     const matricule = `${id}${sexeCode}/${yearCode}`
//     return matricule
//   }
//   return ''
// }
 
const getStatusBadge = (etat: string) => {
  return etat === 'Actif' ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
      Actif
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
      Inactif
    </Badge>
  )
}
 
const getSexeBadge = (sexe: string) => {
  return sexe === 'M' ? (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
      M
    </Badge>
  ) : (
    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
      F
    </Badge>
  )
}
 
export const columns: ColumnDef<EleveTableData>[] = [
  {
    // id: "matricule",
    // header: "Matricule",
    // accessorKey: "id_eleve", // Utiliser une clé existante
    // filterFn: (row, columnId, filterValue) => {
    //   const matricule = Matricule(row.original)
    //   const result = matricule.toLowerCase().includes(String(filterValue).toLowerCase())
    //   console.log('Filter matricule:', { matricule, filterValue, result })
    //   return result
    // },
    // cell: ({ row }) => {
    //   const eleve = row.original
    //   return (
    //     <span className="font-mono text-sm">
    //       {Matricule(eleve)}
    //     </span>
    //   )
    // },
    accessorKey: "matricule",
    header: "Matricule",
    cell: ({ row }) => {
      const matricule = row.original.matricule
      return(
      
          <span className="font-mono text-sm">
            {matricule}
          </span>
          
      )
    }
  },
  {
    accessorKey: "nom_eleve",
    header: "Nom complet",
    cell: ({ row }) => {
      const eleve = row.original
      return (
        <div>
          <span className="font-medium">{eleve.nom_eleve}</span>
          {eleve.post_nom_eleve && (
            <span className="text-muted-foreground ml-2">{eleve.post_nom_eleve}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "sexe",
    header: "Sexe",
    cell: ({ row }) => {
      const eleve = row.original
      return getSexeBadge(eleve.sexe)
    },
  },
  {
    accessorKey: "date_naissance",
    header: "Date de naissance",
    cell: ({ row }) => {
      const eleve = row.original
      return (
        <span className="text-sm">{eleve.date_naissance}</span>
      )
    },
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => {
      const eleve = row.original
      return (
        <span className="text-sm">{eleve.telephone || '-'}</span>
      )
    },
  },
  {
    accessorKey: "etat",
    header: "État",
    cell: ({ row }) => {
      const eleve = row.original
      return getStatusBadge(eleve.etat)
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // These will be passed as props to the DataTable component
      return null // Actions will be handled in the parent component
    },
  },
]
