import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { buttonVariants, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui'
import { useClasseVm } from '@/features/classes/classe_VModel'
import { Loader, Plus, Wallet } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useTypeFraisVm } from '@/features/frais/typeFrais_VModel'
import Link from 'next/link'

interface ClassePickerProps {
  Click?: (frais: any) => void
  currentFrais?: string
}

export function SelectFrais({ Click, currentFrais = "" }: ClassePickerProps) {
    const {data, error, isLoading} = useTypeFraisVm()  
    if(isLoading) return (
        <div>
            <Loader className='animate-spin'/>
        </div>
    )
    if(data.length==0){
        return(
            <div className='space-y-2'>
                <Link href={"/frais"} className={`${buttonVariants({variant:"outline", className:"bg-sidebar-primary text-sidebar-primary-foreground hover:cursor-pointer"})}`}>
                    <Plus/  >
                    <Wallet className=''/>
                    Type de Frais
                </Link>
            </div>
        )
    }

  return (
    <div className="space-y-2">
        <Select value={currentFrais} onValueChange={Click}>
        <SelectTrigger className='font-medium'>
            <SelectValue placeholder="Sélectionner le FRAIS type" />
        </SelectTrigger>
            {
                error? (
                    <p className='font-mono text-red-500'>Erreur lors de la récupération des données</p>
                ) : (
                    <SelectContent className='border-primary'>
                        <ScrollArea className='h-40'>
                            {
                                data.map((frais)=>{
                                    return(
                                        <SelectItem key={frais.id_type_frais} value={frais.id_type_frais.toString()}>{frais.libelle}</SelectItem>
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
