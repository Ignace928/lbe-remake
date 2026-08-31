"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PenBoxIcon, Plus, GraduationCap } from "lucide-react"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from "@/components/search_input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useClasseVm } from "../classe_VModel"
import { playSound } from "@/lib/soundSystem"
import GenerateClasseBtn from "./GenerateClasseBtn"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onEditClasse?: (classe: TData) => void
  onDeleteClasse?: (classe: TData) => void
  onAddClasse?: () => void
  isLoading?: boolean
  className?: string
}

export function ClasseDataTable<TData>({
  columns,
  data,
  onEditClasse,
  onDeleteClasse,
  onAddClasse,
  isLoading = false,
  className,
}: DataTableProps<TData>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [niveauFilter, setNiveauFilter] = React.useState("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  
  // Filter data based on search and filters
  const filteredData = React.useMemo(() => {
    return data.filter((classe: any) => {
      const matchesSearch = !searchTerm || 
        classe.nom_classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.titulaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.delegue_1?.toString().toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.delegue_2?.toString().toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.meilleur_eleve?.toString().toLocaleLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesNiveau = niveauFilter === "all" || classe.niveau === niveauFilter
      
      return matchesSearch && matchesNiveau
    })
  }, [data, searchTerm, niveauFilter])
  
  // onRowSelectionChange: setRowSelection,
  const table = useReactTable({
    data:filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  

  return (
    <div>
        <section className="py-2 pr-4 w-full bg-card fixed z-1 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Input de recherche */}
              <div className="flex-1 max-w-xs">
                <SearchInput
                  setSearchTerm={setSearchTerm}
                  searchTerm={searchTerm}
                  label="Rechercher par nom, titulaire..."
                />
              </div>
              
              {/* Filtre niveau */}
              <div className="flex">
                <Select value={niveauFilter} onValueChange={setNiveauFilter}>
                  <SelectTrigger className='border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground rounded-xl'>
                    <SelectValue placeholder="Tous niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value='Préscolaire'>Préscolaire</SelectItem>
                    <SelectItem value='Primaire'>Primaire</SelectItem>
                    <SelectItem value='Secondaire'>Secondaire</SelectItem>
                    <SelectItem value='Lycée'>Lycée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                {
                  onAddClasse && (
                    <Button 
                      onClick={onAddClasse}
                      className="gap-2 bg-primary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une classe
                    </Button>
                  )
                }
            </div>
          </section>
      <Card
        className={cn(
          "border-none shadow-xl pt-20 pb-10",
          className
        )}
      >
          <ScrollArea className="rounded-md border-primary border-b">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {(searchTerm || niveauFilter !== "all") 
                    ? "Aucune classe trouvée pour ces filtres" 
                    : "Aucune classe trouvée"
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {(searchTerm || niveauFilter !== "all")
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Commencez par ajouter votre première classe"
                  }
                </p>
                {!searchTerm && niveauFilter === "all" && onAddClasse && (
                  <div className="flex gap-4">
                    <Button 
                      onClick={onAddClasse}
                      className="gap-2 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter la première classe
                    </Button>
                    <GenerateClasseBtn/>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full overflow-auto">
                <Table className="w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className='border-primary/10 hover:bg-primary/5'>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className='text-foreground'>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="border-primary/10 hover:bg-primary/5 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => {
                            if (cell.column.id === "actions") {
                              const classe = row.original as any
                              return (
                                <TableCell key={cell.id}>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => onEditClasse(classe)}
                                      className='bg-amber-400 text-black hover:border-amber-400 hover:cursor-pointer'
                                      disabled={isLoading}
                                    >
                                      <PenBoxIcon/>
                                    </Button>
                                    <ModalHandleDelete
                                      personalization='bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer'
                                      btnVariant='outline'
                                      title={`Supprimer la classe ${classe.nom_classe}`}
                                      description={`Voulez-vous supprimer definitivement la classe ${classe.nom_classe} (${classe.niveau})?`}
                                      onConfirm={() => onDeleteClasse(classe)}
                                      state={isLoading}
                                    />
                                  </div>
                                </TableCell>
                              )
                            }
                            return (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Aucune classe trouvée.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
          <div className="fixed bottom-0 justify-center backdrop-blur-lg bg-card/80 w-1/2 flex flex-col items-center">

            <p className="shrink-0 border-t border-primary/10 px-6 py-3 text-center text-sm text-muted-foreground">
              {filteredData.length} classe{filteredData.length > 1 ? "s" : ""} affichée
              {filteredData.length !== data.length
                ? ` sur ${data.length} au total`
                : " (toutes les classes de la base)"}
            </p>
            
          </div>
      </Card>
    </div>
  )
}


