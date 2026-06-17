"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Eye, Users } from "lucide-react"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchInput } from "@/components/search_input"
import { Inscription, UpdateInscription } from "../inscription_types"
import { SummaryStudentSmall } from "@/components/classe/SummaryStudent"
import { cn } from "@/lib/utils"
import { Classe } from "@/features/classes/classe_types"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onDeleteInscription?: (inscription: UpdateInscription) => void
  describeInscription: (inscription: Inscription) => void
  isLoading?: boolean
  headerActions?: React.ReactNode
  className?: string
  classe?: Classe
  onClasseUpdated?: (classe: Classe) => void
}

export function InscriptionDataTable<TData>({
  columns,
  data,
  onDeleteInscription,
  describeInscription,
  isLoading = false,
  headerActions,
  classe,
  onClasseUpdated,
}: DataTableProps<TData>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  // const [sorting, setSorting] = React.useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
  //   []
  // )
  // const [rowSelection, setRowSelection] = React.useState({})
  const filteredData = React.useMemo(() => {
      return data.filter((inscription: any) => {
        const matchesSearch = !searchTerm || 
          `${inscription.eleve?.nom_eleve?.toLowerCase()} ${inscription.eleve?.post_nom_eleve?.toLowerCase()}`.includes(searchTerm.toLowerCase()) ||
          inscription.eleve?.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
        
        // const matchesNiveau = niveauFilter === "all" || classe.niveau === niveauFilter
        
        return matchesSearch //&& matchesNiveau
      })
    }, [data, searchTerm])

  const table = useReactTable({
    data:filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  

  return (
    <div>
      <section className="p-4 pr-6 mr-4 w-full bg-card fixed z-1 flex items-center justify-between">
        <SearchInput
          label="Matricule ou Nom"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {headerActions ?? (
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Liste des inscriptions
          </CardTitle>
        )}
      </section>
        

        <Card className="border-none shadow-xl pt-20">
          <ScrollArea className="rounded-md">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-primary/10 hover:bg-primary/5"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-foreground">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      const inscription = row.original as UpdateInscription
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="border-primary/10 hover:bg-primary/5"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="bg-primary text-primary-foreground hover:border-primary hover:cursor-pointer"
                                onClick={() =>
                                  describeInscription(
                                    row.original as Inscription
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <ModalHandleDelete
                                onConfirm={() =>
                                  onDeleteInscription?.(inscription)
                                }
                                personalization="bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer"
                                btnVariant="outline"
                                state={isLoading}
                                title="Supprimer l'inscription"
                                description="Êtes-vous sûr de vouloir supprimer cette inscription ? Cette action est irréversible."
                              />
                              {classe ? (
                                <SummaryStudentSmall
                                  classe={classe}
                                  eleveId={inscription.id_eleve}
                                />
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {isLoading
                          ? "Chargement..."
                          : "Aucune inscription trouvée."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        
        <section  className="fixed bottom-0 w-full bg-card rounded-2xl mb-2 px-6 py-3 text-center text-sm text-muted-foreground">
          <p>
            {filteredData.length} Elève{filteredData.length > 1 ? "s" : ""}{filteredData.length !== data.length ? ` / ${data.length}  Total` : " (Effectif total)"}
          </p>
        </section>
    
    </div>
  )
}
