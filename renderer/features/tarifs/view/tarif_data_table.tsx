"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Plus,
} from "lucide-react"
import { PenBoxIcon } from "lucide-react"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { Calculator } from "lucide-react"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from "@/components/search_input"
import { TarifForm } from "./tarif_form"
import { CreateTarif } from "../tarif_types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onCreateTarif?:(tarif:CreateTarif)=>void
  onEditTarif?: (tarif: TData) => void
  onDeleteTarif?: (tarif: TData) => void
  isLoading?: boolean
}

export function TarifDataTable<TData>({
  columns,
  data,
  onCreateTarif,
  onEditTarif,
  onDeleteTarif,
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [level, setLevel] = React.useState('All')
  const [rowSelection, setRowSelection] = React.useState({})
  const [add, setAdd] = React.useState<boolean>(false)

  // Add actions column
  const columnsWithActions: ColumnDef<TData>[] = React.useMemo(() => [
    ...columns.slice(0, -1), // Remove the placeholder actions column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const tarif = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEditTarif?.(tarif)}
              className='bg-amber-400 text-black hover:border-amber-400 hover:cursor-pointer'
            >
              <PenBoxIcon/>
            </Button>
            <ModalHandleDelete
              onConfirm={() => onDeleteTarif?.(tarif)}
              personalization="bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer"
              btnVariant="outline"
              state={isLoading}
              title="Supprimer le tarif"
              description="Êtes-vous sûr de vouloir supprimer ce tarif ? Cette action est irréversible."
            />
          </div>
        )
      },
    },
  ], [columns, onEditTarif, onDeleteTarif, isLoading])
  const filteredData = React.useMemo(() => {
      let filtered = data
      
      // Filtre par recherche textuelle
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase()
        filtered = filtered.filter((item: any) => {
          // Recherche par nom, post_nom, téléphone
          const nameMatch = 
            String(item.classe.nom_classe || "").toLowerCase().includes(lowercasedSearch) ||
            String(item.typeFrais.libelle || "").toLowerCase().includes(lowercasedSearch)
          
          // Recherche par matricule
          
          return nameMatch
        })
      }
      if(level !== "All"){
        filtered = filtered.filter((i:any)=>i.classe.niveau === level)
      }
      
      return filtered
    }, [data, searchTerm, level])
    
  const tableWithActions = useReactTable({
    data:filteredData,
    columns: columnsWithActions,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
      <Card className="border-none flex flex-col min-h-0 h-full p-2">
        <CardHeader>
          <div className="grid grid-cols-2">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Liste des tarifs
            </CardTitle>
            <div className="col-span-1 grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <SearchInput
                    label="Rechercher un tarif..."
                    searchTerm={searchTerm}
                    setSearchTerm={(e)=>setSearchTerm(e)}
                  />
                </div>

                <div className="flex">
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className='border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground rounded-xl'>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='All'>Tout Niveaux</SelectItem>
                      <SelectItem value='Préscolaire'>Préscolaire</SelectItem>
                      <SelectItem value='Primaire'>Primaire</SelectItem>
                      <SelectItem value='Secondaire'>Secondaire</SelectItem>
                      <SelectItem value='Lycée'>Lycée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1 items-center justify-between">
                  <Button onClick={()=>setAdd(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau tarif
                  </Button>
                  <TarifForm
                    trigger={<div/>}
                    isOpen={add}
                    close={()=>setAdd(false)}
                    onSubmit={onCreateTarif}
                    title="Ajouter un nouveau tarif"
                    description="Remplissez les informations pour créer un nouveau tarif."
                    submitButtonText="Créer le tarif"
                  />
                </div>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="rounded-md">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {tableWithActions.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="border-primary " key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className="font-bold text-medium" key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="">
                {tableWithActions.getRowModel().rows?.length ? (
                  tableWithActions.getRowModel().rows.map((row) => (
                    <TableRow
                      className="border-0 hover:border-b border-primary/20"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className=" items-center justify-center" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {isLoading ? "Chargement..." : "Aucun tarif trouvé."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </Card>
  )
}
