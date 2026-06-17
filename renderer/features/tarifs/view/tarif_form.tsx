import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateTarif, UpdateTarif, createTarifSchema, updateTarifSchema } from '../tarif_types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import { SelectFrais } from '@/components/frais/frais_select'
import { useAnneeStore } from '@/store/anneStore'
import { SelectClasse } from '@/components/classe/classe_select'

interface TarifFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data: CreateTarif | UpdateTarif) => void
  tarif?: CreateTarif | UpdateTarif | null
  isOpen?:boolean,
  close?:()=>void,
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
  disabled?: boolean
}

export function TarifForm({
  trigger,
  onSubmit,
  tarif,
  isLoading = false,
  isOpen,
  close,
  submitButtonText = "Enregistrer",
  disabled = false
}: TarifFormProps) {
  const idAnne = useAnneeStore().anne_Active.id_anne
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateTarif | UpdateTarif>({
    resolver: zodResolver(tarif ? updateTarifSchema : createTarifSchema),
    defaultValues:{
      id_classe:0,
      id_type_frais:0,
      montant_fixe:0
    }
  })
  function restart(){
    reset({
      id_classe:0,
      id_type_frais:0,
      montant_fixe:0
    })
    close()
  }
  useEffect(() => {
    if (tarif) {
      reset({
          id_classe:tarif.id_classe,
          id_type_frais:tarif.id_type_frais,
          montant_fixe:tarif.montant_fixe
        })
    }
  }, [tarif, reset])

  const onFormSubmit = handleSubmit(
    (data: CreateTarif | UpdateTarif) => {
      onSubmit(data)
      restart()
      if(tarif){
        close()
      }
    }
  ) 


  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau tarif
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tarif ? "Modifier le tarif" : "Ajouter un nouveau tarif"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tarif ? "Modifiez les informations du tarif ci-dessous." : "Remplissez les informations pour créer un nouveau tarif."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ScrollArea className="max-h-100 pr-4">
          <form onSubmit={onFormSubmit} id="formulaire" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <div className="space-y-2">
                <label htmlFor="id_classe" className="text-sm font-medium">
                  ID Classe *
                </label>
                <SelectClasse
                  Click={(f)=>setValue("id_classe", Number(f))}
                  currentClasse={watch("id_classe").toString()||""}
                />
                {errors.id_classe && (
                  <p className="text-sm text-red-500">{errors.id_classe.message}</p>
                )}
              </div>

              

              <div className="space-y-2">
                <label htmlFor="id_type_frais" className="text-sm font-medium">
                  ID Type Frais *
                </label>
                <SelectFrais
                  Click={(f)=>setValue("id_type_frais", Number(f))}
                  currentFrais={watch("id_type_frais").toString()||""}
                />
                {errors.id_type_frais && (
                  <p className="text-sm text-red-500">{errors.id_type_frais.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="montant_fixe" className="text-sm font-medium">
                  Montant fixe *
                </label>
                <Input
                  id="montant_fixe"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('montant_fixe', { valueAsNumber: true })}
                  className={errors.montant_fixe ? 'border-red-500' : ''}
                />
                {errors.montant_fixe && (
                  <p className="text-sm text-red-500">{errors.montant_fixe.message}</p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={restart}>Annuler</AlertDialogCancel>
          <Button 
            type='submit'
            form='formulaire'
            disabled={disabled || isLoading}
          >
            {isLoading ? "Enregistrement..." : submitButtonText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
