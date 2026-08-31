import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ClasseSearchByName } from './classe_search_by_name'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui'
import { useClasseVm } from '@/features/classes/classe_VModel'
import { BookMarked, Loader, Plus } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import Link from 'next/link'

interface ClassePickerProps {
  Click?: (classe: any) => void
  currentClasse?: string
}

export function SelectClasse({ Click, currentClasse = "" }: ClassePickerProps) {
    const {data, error, isLoading} = useClasseVm()  
    if(isLoading) return (
        <div>
            <Loader className='animate-spin'/>
        </div>
    )
    if(data.length==0){
        return(
            <div className='space-y-2'>
                <Link href={"/classe"} className={`${buttonVariants({variant:"outline", className:"bg-sidebar-primary text-sidebar-primary-foreground hover:cursor-pointer"})}`}>
                    <Plus/>
                    <BookMarked className=''/>
                    Classe
                </Link>
            </div>
        )
    }
  return (
    <div className="space-y-2">
        <Select value={currentClasse} onValueChange={Click}>
        <SelectTrigger className='font-medium border-primary/30'>
            <SelectValue placeholder="Sélectionner une classe" />
        </SelectTrigger>
            {
                 error? (
                    <p className='font-mono text-red-500'>Erreur lors de la récupération des données</p>
                ) : (
                    <SelectContent>
                        <ScrollArea className='h-40'>
                            {
                                data.map((classe)=>{
                                    return(
                                        <SelectItem key={classe.id_classe} value={classe.id_classe.toString()}>{classe.nom_classe}</SelectItem>
                                    )
                                })
                            }
                        </ScrollArea>
                    </SelectContent>
                )
            }
        </Select>
    </div>
  )
}
