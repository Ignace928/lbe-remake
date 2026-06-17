import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateInscription, UpdateInscription, createInscriptionSchema, updateInscriptionSchema } from '../inscription_types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useInscriptionVm } from '../inscription_VModel'
import { useAnneeStore } from '@/store/anneStore'
import { ElevePicker } from '@/components/eleve/eleve-picker'
import { ClassePicker } from '@/components/classe/ClassePicker'
import { SelectClasse } from '@/components/classe/classe_select'
import { useInscriptionStore } from '@/store/inscriptionStore'

interface InscriptionFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  open: boolean
  close:()=>void
  inscription?: CreateInscription | UpdateInscription | null
  idClasse?:number
  isLoading?: boolean
  disabled?: boolean
}

export function InscriptionForm({trigger, open, close, inscription, idClasse, isLoading = false, disabled = false}: InscriptionFormProps) {
  const {anne_Active} = useAnneeStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues
  } = useForm<CreateInscription | UpdateInscription>({
    resolver: zodResolver(inscription ? updateInscriptionSchema : createInscriptionSchema),
    defaultValues: inscription || {
      id_classe: idClasse,
      id_eleve: 0,
      id_annee: anne_Active.id_anne,
      passant: true,
    }
  })
  useEffect(() => {
    if (inscription) {
      reset(inscription)
    }
    else if(idClasse){
      reset(inscription)
    }
  }, [inscription, reset, idClasse])

  const {createInscription, updateInscription, refetch} = useInscriptionVm()
  const clear = useInscriptionStore((state) => state.clear)
  const handleCreateInscription = async (data: CreateInscription) => {
    try {
      await createInscription.mutateAsync(data)
      toast.success("Inscription créée avec succès")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'inscription"
      toast.error(errorMessage)
      console.error(error)
    }
  }

  const handleUpdateInscription = async (data: UpdateInscription) => {
    try {
      await updateInscription.mutateAsync({ id: data.id_inscription, data })
      toast.success("Inscription mise à jour avec succès")
    } catch (error) {
      toast.error(error.message || "erreur de la modification")
    }
  }

  const onFormSubmit = async (data: CreateInscription | UpdateInscription) => {
    
    try {
      if(inscription){
        await handleUpdateInscription(data as UpdateInscription)
        close()
        reset()
        clear()
      }
      else{
        await handleCreateInscription(data as CreateInscription)
        close()
        reset()
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
    }
  }

  const passant = watch('passant')

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle inscription
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className='text-primary'>
            {inscription ? "Modifier l'inscription" : "Ajouter une nouvelle inscription"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {inscription ? "Modifiez les informations de l'inscription ci-dessous." : "Remplissez les informations pour créer une nouvelle inscription."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ScrollArea className="max-h-100 pr-4 text-foreground">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="id_eleve" className="text-sm font-medium">
                  Élève *
                </label>
                <ElevePicker currentStudent={watch("id_eleve").toString()} Click={(s)=>{setValue("id_eleve", s.id_eleve, {shouldValidate: true})}}/>
                <Input
                  
                  id="id_eleve"
                  type="number"
                  placeholder="ID de l'élève"
                  {...register('id_eleve', { valueAsNumber: true })}
                  className={errors.id_eleve ? 'border-red-500 hidden' : 'hidden'}
                />
                {errors.id_eleve && (
                  <p className="text-sm text-red-500">{errors.id_eleve.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="id_classe" className="text-sm font-medium">
                  Classe *
                </label>
                <SelectClasse currentClasse={watch("id_classe").toString() || ""} Click={(d)=>{setValue("id_classe",d)}}/>
                <Input
                  className='hidden'
                  id="id_classe"
                  type="number"
                  placeholder="ID de la classe"
                  // hidden
                  readOnly
                  {...register('id_classe', { valueAsNumber: true })}
                />
                {errors.id_classe && (
                  <p className="text-sm text-red-500">{errors.id_classe.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="id_annee" className="text-sm font-medium">
                  Année scolaire
                </label>
                <Input readOnly value={anne_Active.labelle}/>
                <Input
                  id="id_annee"
                  value={anne_Active.id_anne}
                  readOnly
                  placeholder="Ex: 2023-2024"
                  {...register('id_annee')}
                  className='hidden'
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passant" className="text-sm font-medium">
                  Statut passant
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="passant"
                    checked={passant}
                    onCheckedChange={(checked) => setValue('passant', checked)}
                  />
                  <Label htmlFor="passant" className="text-sm">
                    {passant ? 'Passant' : 'Redoublant'}
                  </Label>
                </div>
              </div>
            </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              reset()
              close()
            }}>
              Annuler
            </AlertDialogCancel>
            <Button 
              type="submit"
              disabled={disabled || isLoading}
            >
              {isLoading ? "Enregistrement..." : inscription ? "Appliquer la modification" : "Inscrire"}
            </Button>
          </AlertDialogFooter>
          </form>
        </ScrollArea>

      </AlertDialogContent>
    </AlertDialog>
  )
}
