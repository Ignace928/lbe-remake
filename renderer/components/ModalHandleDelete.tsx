<<<<<<< HEAD
import React, { ReactNode } from 'react'
=======
import React from 'react'
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeftFromLineIcon, Trash2 } from 'lucide-react'
// import Head from 'next/head'
// import { Card } from '@/components/ui/card'
// import { HeaderComponent } from '@/components/layout/header'
// import { useAnneeStore } from '@/store/anneStore'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

interface DeleterProps {
<<<<<<< HEAD
    children?:ReactNode,
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    personalization: string,
    btnVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost",
    state: boolean,
    title: string,
    description: string,
    onConfirm: () => void
}
<<<<<<< HEAD
export default function ModalHandleDelete({ children, personalization, btnVariant, state, title, description, onConfirm }:DeleterProps) {
=======
export default function ModalHandleDelete({ personalization, btnVariant, state, title, description, onConfirm }:DeleterProps) {
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
//   const {anne_Active} = useAnneeStore()

  return (
    <AlertDialog>
        <AlertDialogTrigger disabled={state} className={`${buttonVariants({variant:`${btnVariant}`, className:`${personalization}`})}`}>
<<<<<<< HEAD
            {
                children?children:<Trash2/>
            }
=======
            <Trash2/>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        </AlertDialogTrigger>
        <AlertDialogContent className='border-destructive'>
            <AlertDialogHeader className='text-foreground text-2xl'>
                <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            
<<<<<<< HEAD
            <AlertDialogDescription className='text-foreground font-semibold'>
=======
            <AlertDialogDescription className='text-foreground text-lg font-extralight'>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
                {description}
            </AlertDialogDescription>

            <AlertDialogFooter>
                <AlertDialogCancel className={buttonVariants({variant:'secondary'})}>Annuler</AlertDialogCancel>
                <AlertDialogAction className={`${buttonVariants({variant:'destructive'})} rounded-full cursor-pointer`} onClick={onConfirm}>
                    Confirmer
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
