import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateAnneeScolaire, UpdateAnneeScolaire, createAnneeScolaireSchema, updateAnneeScolaireSchema } from '../anneeScolaire_types'

interface AnneeScolaireFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data: CreateAnneeScolaire | UpdateAnneeScolaire) => void
  anneeScolaire?: CreateAnneeScolaire | UpdateAnneeScolaire | null
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AnneeScolaireForm({
  variant = "default",
  size = "default",
  style = "",
  trigger,
  onSubmit,
  anneeScolaire,
  isLoading = false,
  title,
  description,
  submitButtonText = "Enregistrer",
  disabled = false,
  open,
  onOpenChange
}: AnneeScolaireFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateAnneeScolaire | UpdateAnneeScolaire>({
    resolver: zodResolver(anneeScolaire ? updateAnneeScolaireSchema : createAnneeScolaireSchema),
    defaultValues: anneeScolaire || {
      libelle: ''
    }
  })

  // Synchroniser le formulaire avec les données de l'année scolaire
  useEffect(() => {
    if (anneeScolaire) {
      reset(anneeScolaire)
    }
  }, [anneeScolaire, reset])

  const onFormSubmit = (data: CreateAnneeScolaire | UpdateAnneeScolaire) => {
    try {
      onSubmit(data)
      reset({
        libelle: ''
      })
      if (onOpenChange) {
        onOpenChange(false) // Fermer la boîte de dialogue après soumission
      }
    } catch (error) {
      console.error('Erreur dans onFormSubmit:', error)
    }
  }

  // Si trigger est null, afficher directement le contenu, sinon utiliser AlertDialog
  if (trigger === null) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md border-primary text-foreground">
          <AlertDialogHeader className='text-2xl'>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='text-lg font-extralight'>
            {description}
          </AlertDialogDescription>
          
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Libellé de l'année scolaire</label>
              <Input
                {...register('libelle')}
                placeholder="Ex: 2024-2025"
                className={`font-medium ${errors.libelle ? 'border-red-500' : ''}`}
              />
              {errors.libelle && (
                <p className="text-sm text-red-600 mt-1">{errors.libelle.message}</p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({ variant: 'secondary' })}>
                Annuler
              </AlertDialogCancel>
              <Button 
                type="submit" 
                disabled={isLoading || disabled}
                className='rounded-full cursor-pointer'
              >
                {isLoading ? 'Traitement...' : submitButtonText}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant, className: `${style}`, size })}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md border-primary text-foreground">
        <AlertDialogHeader className='text-2xl'>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className='text-lg font-extralight'>
          {description}
        </AlertDialogDescription>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Libellé de l'année scolaire</label>
            <Input
              {...register('libelle')}
              placeholder="Ex: 2024-2025"
              className={`font-medium ${errors.libelle ? 'border-red-500' : ''}`}
            />
            {errors.libelle && (
              <p className="text-sm text-red-600 mt-1">{errors.libelle.message}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className={buttonVariants({ variant: 'secondary' })}>
              Annuler
            </AlertDialogCancel>
            <Button 
              type="submit" 
              disabled={isLoading || disabled}
              className='rounded-full cursor-pointer'
            >
              {isLoading ? 'Traitement...' : submitButtonText}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
