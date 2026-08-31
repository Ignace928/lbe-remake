import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateTypeFrais, UpdateTypeFrais, createTypeFraisSchema, updateTypeFraisSchema } from '../typeFrais_types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TypeFraisFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data:CreateTypeFrais | UpdateTypeFrais)=>void
  typeFrais?: CreateTypeFrais | UpdateTypeFrais | null
  isLoading?: boolean
  submitButtonText:string
  showform?:boolean
  hiddeform?:()=>void
  disabled?: boolean
}

export function TypeFraisForm({ showform, hiddeform, trigger, typeFrais, isLoading = false, disabled = false, onSubmit, submitButtonText="Enregistrer" }: TypeFraisFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTypeFrais | UpdateTypeFrais>({
    resolver: zodResolver(typeFrais ? updateTypeFraisSchema : createTypeFraisSchema),
  })

  useEffect(() => {
    if (typeFrais) {
      reset({
        detail:typeFrais.detail,
        libelle:typeFrais.libelle,
        freq:typeFrais.freq
      })
    }
    else reset({
      detail:"",
      libelle:"",
      freq:1
    })
  }, [typeFrais, reset])

  const resetForm = () => {
    reset()
    if (hiddeform) {
      hiddeform()
    }
  }
  

  const onFormSubmit = handleSubmit((data:CreateTypeFrais | UpdateTypeFrais)=>{
    onSubmit(data)
    resetForm()
  })

  return (
    <AlertDialog open={showform}>
      <AlertDialogTrigger>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {typeFrais ? "Modifier le type de frais" : "Ajouter un nouveau type de frais"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {typeFrais ? "Modifiez les informations du type de frais ci-dessous." : "Remplissez les informations pour créer un nouveau type de frais."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ScrollArea className="max-h-100 pr-4">
          <form onSubmit={onFormSubmit} id='formulaire' className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="space-y-2">
                  <label htmlFor="libelle" className="text-sm font-medium">
                    Libellé *
                  </label>
                  <Input
                    id="libelle"
                    placeholder="Ex: Frais d'inscription"
                    {...register('libelle')}
                    className={errors.libelle ? 'border-red-500' : ''}
                  />
                  {errors.libelle && (
                    <p className="text-sm text-red-500">{errors.libelle.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="freq" className="text-sm font-medium">
                    Nombre d'Occurence *
                  </label>
                  <Input
                    id="freq"
                    type='number'
                    placeholder="Ex: 1 (comme 1 foi/année)"
                    {...register('freq', {valueAsNumber:true})}
                    className={errors.freq ? 'border-red-500' : ''}
                  />
                  {errors.freq && (
                    <p className="text-sm text-red-500">{errors.freq.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="detail" className="text-sm font-medium">
                  Détails
                </label>
                <Textarea
                  id="detail"
                  placeholder="Description détaillée du type de frais..."
                  rows={4}
                  {...register('detail')}
                  className={errors.detail ? 'border-red-500' : ''}
                />
                {errors.detail && (
                  <p className="text-sm text-red-500">{errors.detail.message}</p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={hiddeform}>Annuler</AlertDialogCancel>
          <Button 
            type="submit"
            form="formulaire"
            disabled={disabled || isLoading}
          >
            {isLoading ? "Enregistrement..." : submitButtonText}
          </Button>
            

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
