import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useClasseVm } from '@/features/classes/classe_VModel'
import LoadingPage from '../loadingPage'
import { Classe } from '@/features/classes/classe_types'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { BookMarked } from 'lucide-react'
import { SearchInput } from '../search_input'

interface ClasseListProps {
    className?: string
    Click?: (classe: Classe) => void
}

export function ClasseListe({ className = "", Click}: ClasseListProps) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const {data, error, isLoading} = useClasseVm()

    const filteredClasses = React.useMemo(() => {
        const search = searchTerm.toLowerCase()
        return data.filter((classe) =>
            classe.nom_classe.toLowerCase().includes(search) ||
            classe.niveau?.toLowerCase().includes(search) ||
            classe.titulaire?.toLowerCase().includes(search)
        )

    }, [data, searchTerm])

    if(isLoading || error) return (<LoadingPage size={30}/>)
    
        
return (
    <Card className="flex min-h-0 flex-1 items-center flex-col border-none bg-none">
        <div className="p-4 mr-4 px-10 w-full bg-card fixed z-1 grid grid-cols-4 items-center justify-between">
            <section className='col-span-2'>
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} label='6ème A'/>
            </section>
            <section className='col-span-2 w-full  flex center items-center justify-end-safe gap-4'>
                <BookMarked className="h-5 w-5 text-primary" />
                Classes existantes
            </section>
        </div>

      <CardContent className="min-h-0 flex-1 pt-20 w-3/4">
        <ScrollArea className="h-full min-h-0">

            <Table className={className}>
                <TableHeader className='relative'>
                    <TableRow className='border-primary/10 sticky top-0 hover:bg-primary/5'>
                        <TableHead className='text-foreground'>Classe</TableHead>
                        <TableHead className='text-foreground'>Niveau</TableHead>
                        <TableHead className='text-foreground'>Titulaire</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        filteredClasses.map((classe) =>(
                            <TableRow key={classe.id_classe} onClick={() => Click?.(classe)} className='border-primary/10 hover:cursor-pointer hover:bg-primary/5'>
                                <TableCell className='font-medium text-foreground'>{classe.nom_classe}</TableCell>
                                <TableCell className='font-mono text-xs text-muted-foreground sm:text-sm'>{classe.niveau}</TableCell>
                                <TableCell className='text-muted-foreground'>{classe.titulaire}</TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>

        </ScrollArea>
      </CardContent>

      <section className="sticky bottom-0 border-t border-primary/10 pt-4 backdrop-blur-sm">
        <div className="w-full rounded-xl border border-primary/20 bg-linear-to-br from-muted/20 to-card p-4">
          <p className="text-center text-sm text-muted-foreground">
            Astuce : sélectionnez une classe pour gérer les inscriptions, ou
            créez d&apos;abord vos classes via le bouton en haut à droite.
          </p>
        </div>
      </section>
    </Card>
            
    )
}


