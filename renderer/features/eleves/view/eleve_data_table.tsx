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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react"
import { PenBoxIcon } from "lucide-react"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { Plus, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from "@/components/search_input"
import { ElevePicker } from "@/components/eleve/eleve-picker"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onEditStudent?: (student: TData) => void
  onDeleteStudent?: (id: number) => void
  isUpdatePending?: boolean
  onAddStudent?: () => void
}

export function DataTable<TData>({
  columns,
  data,
  onEditStudent,
  onDeleteStudent,
  isUpdatePending = false,
  onAddStudent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sexeFilter, setSexeFilter] = React.useState<string>("all")
  const [etatFilter, setEtatFilter] = React.useState<string>("Actif")

  // Filtrer les données manuellement
  const filteredData = React.useMemo(() => {
    let filtered = data
    
    // Filtre par recherche textuelle
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase()
      filtered = filtered.filter((item: any) => {
        // Recherche par nom, post_nom, téléphone
        const nameMatch = 
          String(item.nom_eleve || "").toLowerCase().includes(lowercasedSearch) ||
          String(item.post_nom_eleve || "").toLowerCase().includes(lowercasedSearch) ||
          String(item.telephone || "").toLowerCase().includes(lowercasedSearch) ||
          String(item.matricule || "").toLowerCase().includes(lowercasedSearch) 
        
        // Recherche par matricule
        
        return nameMatch
      })
    }
    
    // Filtre par sexe
    if (sexeFilter !== "all") {
      filtered = filtered.filter((item: any) => item.sexe === sexeFilter)
    }
    
    // Filtre par état
    if (etatFilter !== "all") {
      filtered = filtered.filter((item: any) => item.etat === etatFilter)
    }
    
    return filtered
  }, [data, searchTerm, sexeFilter, etatFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  React.useEffect(()=>{
    table.setPageSize(50)
  },[])
  return (
    <div className="">
        <section className="p-4 mr-1 w-full bg-card fixed z-1 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Input de recherche */}
            <SearchInput
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              label="Rechercher par nom, matricule..."
            />
            <ElevePicker currentStudent="" Click={(e)=>onEditStudent(e)}/>
            {/* Filtres dropdown */}
            <div className="flex">
              <Select value={sexeFilter} onValueChange={setSexeFilter}>
                <SelectTrigger className='border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground rounded-xl'>
                  <SelectValue placeholder="M et F" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">M et F</SelectItem>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={etatFilter} onValueChange={setEtatFilter}>
                <SelectTrigger className='border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground rounded-xl'>
                  <SelectValue placeholder="Actif et inactif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Actif et inactif</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="flex-1 text-sm text-muted-foreground">
              ( {filteredData.length} sur{" "}
              {data.length} lignes )
            </div>
          </div>
          <div className="flex items-center gap-2">
              {
                onAddStudent && (
                  <Button 
                    onClick={onAddStudent}
                    className="gap-2 bg-primary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un élève
                  </Button>
                )
              }
          </div>
        </section>

    <Card className="border-none shadow-xl pt-20">
        <ScrollArea className="rounded-md">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {(searchTerm || sexeFilter !== "all" || etatFilter !== "all") 
                  ? "Aucun élève trouvé pour ces filtres" 
                  : "Aucun élève trouvé"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {(searchTerm || sexeFilter !== "all" || etatFilter !== "all")
                  ? "Essayez de modifier vos critères de recherche" 
                  : "Commencez par ajouter votre premier élève"
                }
              </p>
              {!searchTerm && sexeFilter === "all" && etatFilter === "all" && onAddStudent && (
                <Button 
                  onClick={onAddStudent}
                  className="gap-2 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter le premier élève
                </Button>
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
                          if (cell.column.id === "actions" && onEditStudent && onDeleteStudent) {
                            const eleve = row.original as any
                            return (
                              <TableCell key={cell.id}>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => onEditStudent(eleve)}
                                    className='bg-amber-400 text-black hover:border-amber-400 hover:cursor-pointer'
                                    disabled={isUpdatePending}
                                  >
                                    <PenBoxIcon/>
                                  </Button>
                                  <ModalHandleDelete
                                    personalization='bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer'
                                    btnVariant='outline'
                                    title={`Supprimer le Matricule N°${eleve.matricule}`}
                                    description={`Voulez-vous supprimer definitivement ${eleve.nom_eleve} ${eleve.post_nom_eleve || ''}?`}
                                    onConfirm={() => onDeleteStudent(eleve.id_eleve)}
                                    state={isUpdatePending}
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
                        Aucun élève trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </ScrollArea>
        
        {/* Pagination */}
    </Card>
      
    </div>
  )
}

        // <div className="flex items-center justify-between px-2">
        //   <div className="flex-1 text-sm text-muted-foreground">
        //     {/* {table.getFilteredSelectedRowModel().rows.length} sur{" "} */}
        //     {filteredData.length} lignes
        //   </div>
        //   <div className="flex items-center space-x-6 lg:space-x-8">
        //     <div className="flex items-center space-x-2">
        //       <p className="text-sm font-medium">Lignes par page</p>
        //       <Select
        //         value={`${table.getState().pagination.pageSize}`}
        //         onValueChange={(value) => {
        //           table.setPageSize(Number(value))
        //         }}
        //       >
        //         <SelectTrigger className="h-8 w-17.5">
        //           <SelectValue defaultValue={"50"} placeholder={table.getState().pagination.pageSize} />
        //         </SelectTrigger>
        //         <SelectContent side="top">
        //           {[4, 30, 50, 100].map((pageSize) => (
        //             <SelectItem key={pageSize} value={`${pageSize}`}>
        //               {pageSize}
        //             </SelectItem>
        //           ))}
        //         </SelectContent>
        //       </Select>
        //     </div>
        //     <div className="flex w-25 items-center justify-center text-sm font-medium">
        //       Page {table.getState().pagination.pageIndex + 1} sur{" "}
        //       {table.getPageCount()}
        //     </div>
        //     <div className="flex items-center space-x-2">
        //       <Button
        //         variant="outline"
        //         className="hidden h-8 w-8 p-0 lg:flex"
        //         onClick={() => table.setPageIndex(0)}
        //         disabled={!table.getCanPreviousPage()}
        //       >
        //         <span className="sr-only">Première page</span>
        //         <ArrowLeftIcon className="h-4 w-4" />
        //       </Button>
        //       <Button
        //         variant="outline"
        //         className="h-8 w-8 p-0"
        //         onClick={() => table.previousPage()}
        //         disabled={!table.getCanPreviousPage()}
        //       >
        //         <span className="sr-only">Page précédente</span>
        //         <ChevronLeftIcon className="h-4 w-4" />
        //       </Button>
        //       <Button
        //         variant="outline"
        //         className="h-8 w-8 p-0"
        //         onClick={() => table.nextPage()}
        //         disabled={!table.getCanNextPage()}
        //       >
        //         <span className="sr-only">Page suivante</span>
        //         <ChevronRightIcon className="h-4 w-4" />
        //       </Button>
        //       <Button
        //         variant="outline"
        //         className="hidden h-8 w-8 p-0 lg:flex"
        //         onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        //         disabled={!table.getCanNextPage()}
        //       >
        //         <span className="sr-only">Dernière page</span>
        //         <ArrowRightIcon className="h-4 w-4" />
        //       </Button>
        //     </div>
        //   </div>
        // </div>