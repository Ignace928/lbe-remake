import React from 'react'
import Head from 'next/head'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon, Trash2 } from 'lucide-react'
import { useAnneeStore } from '@/store/anneStore'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

interface DeleterProps {
    personalization: string,
    btnVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost",
    state: boolean,
    title: string,
    description: string,
    onConfirm: () => void
}
export default function ModalHandleDelete({ personalization, btnVariant, state, title, description, onConfirm }:DeleterProps) {
  const {anne_Active} = useAnneeStore()

  return (
    <AlertDialog>
        <AlertDialogTrigger disabled={state} className={`${buttonVariants({variant:`${btnVariant}`, className:`${personalization}`})}`}>
            <Trash2/>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader className='text-[#1A1A1D] text-2xl'>
                <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            
            <AlertDialogDescription className='text-[#252324] text-lg font-extralight'>
                {description}
            </AlertDialogDescription>

            <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary'})}>Annuler</AlertDialogCancel>
                <AlertDialogAction className='rounded-full cursor-pointer bg-destructive' onClick={onConfirm}>
                    Confirmer
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
