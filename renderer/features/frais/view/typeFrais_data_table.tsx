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
import { PenBoxIcon } from "lucide-react"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { Plus } from "lucide-react"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from "@/components/search_input"
import { TypeFraisForm } from "./typeFrais_form"
import { CreateTypeFrais } from "../typeFrais_types"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onEditTypeFrais?: (typeFrais: TData) => void
  Delete?: (typeFrais: TData) => void
  AddNew: (typeFrais: CreateTypeFrais) => void
  isLoading?: boolean
}

export function TypeFraisDataTable<TData>({
  columns,
  data,
  onEditTypeFrais,
  Delete,
  AddNew,
  isLoading = false,
}: DataTableProps<TData>) {
  const [show, setShow] = React.useState<boolean>(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
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

  // Add actions column
  const columnsWithActions: ColumnDef<TData>[] = React.useMemo(() => [
    ...columns.slice(0, -1), // Remove the placeholder actions column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const typeFrais = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEditTypeFrais(typeFrais)}
              className='bg-amber-400 text-black hover:border-amber-400 hover:cursor-pointer'
            >
              <PenBoxIcon/>
            </Button>
            <ModalHandleDelete
              onConfirm={() => Delete?.(typeFrais)}
              personalization="bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer"
              btnVariant="outline"
              state={isLoading}
              title="Supprimer le type de frais"
              description="Êtes-vous sûr de vouloir supprimer ce type de frais ? Cette action est irréversible."
            />
          </div>
        )
      },
    },
  ], [columns, onEditTypeFrais, Delete, isLoading])

  const tableWithActions = useReactTable({
    data,
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 w-full">
                <div className="flex-1">
                  <SearchInput
                    label="Rechercher un type de frais..."
                    searchTerm={(tableWithActions.getColumn("libelle")?.getFilterValue() as string) ?? ""}
                    setSearchTerm={(value) =>
                      tableWithActions.getColumn("libelle")?.setFilterValue(value)
                    }
                  />
                </div>
                <div className="">
                  <Button onClick={()=>setShow(true)}>
                    <Plus className=" h-4 w-4 mr-2" />
                    Nouveau type de frais
                  </Button>
                  <TypeFraisForm
                      showform={show}
                      hiddeform={()=>setShow(false)}
                      trigger={<div/>}
                      onSubmit={AddNew}
                      submitButtonText="Ajouter"
                  />
                </div>
            </CardTitle>
          </div>
        </CardHeader>
          <ScrollArea className="rounded-md">
            <div className="rounded-md">
              <Table>
                <TableHeader className="">
                  {tableWithActions.getHeaderGroups().map((headerGroup) => (
                    <TableRow className="border-primary" key={headerGroup.id}>
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
                <TableBody>
                  {tableWithActions.getRowModel().rows?.length ? (
                    tableWithActions.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-0 hover:border-b border-primary/20"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        {isLoading ? "Chargement..." : "Aucun type de frais trouvé."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
                                {/* Pagination */}
          {/* <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {tableWithActions.getFilteredSelectedRowModel().rows.length} sur{" "}
              {tableWithActions.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Lignes par page</p>
                <Select
                  value={`${tableWithActions.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    tableWithActions.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-17.5">
                    <SelectValue placeholder={tableWithActions.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-25 items-center justify-center text-sm font-medium">
                Page {tableWithActions.getState().pagination.pageIndex + 1} sur{" "}
                {tableWithActions.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => tableWithActions.setPageIndex(0)}
                  disabled={!tableWithActions.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => tableWithActions.previousPage()}
                  disabled={!tableWithActions.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => tableWithActions.nextPage()}
                  disabled={!tableWithActions.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => tableWithActions.setPageIndex(tableWithActions.getPageCount() - 1)}
                  disabled={!tableWithActions.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div> */}
      </Card>
  )
}
