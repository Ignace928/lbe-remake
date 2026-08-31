import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateClasse, UpdateClasse, createClasseSchema, updateClasseSchema } from '../classe_types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import { ElevePicker } from '@/components/eleve/eleve-picker'

interface ClasseFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data: CreateClasse | UpdateClasse) => void
  classe?: CreateClasse | UpdateClasse | null
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
  showform?:boolean
  hiddeform?:()=>void
  disabled?: boolean
}

export function ClasseForm({
  trigger,
  onSubmit,
  classe,
  isLoading = false,
  submitButtonText = "Enregistrer",
  showform,
  hiddeform,
  disabled = false
}: ClasseFormProps) {
  const [eleve, setEleve] = useState({
    delegue_1: null as number | null,
    delegue_2: null as number | null,
    meilleur_eleve: null as number | null,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateClasse | UpdateClasse>({
    resolver: zodResolver(classe ? updateClasseSchema : createClasseSchema),
  })

  // const handleDelegue1 = (student: any) => {
  //   setEleve(prev => ({
  //     ...prev,
  //     delegue_1: student.id_eleve
  //   }))
  //   setValue('delegue_1', student.id_eleve)
  // }

  // const handleDelegue2 = (student: any) => {
  //   setEleve(prev => ({
  //     ...prev,
  //     delegue_2: student.id_eleve
  //   }))
  //   setValue('delegue_2', student.id_eleve)
  // }

  // const handleBestof = (student: any) => {
  //   setEleve(prev => ({
  //     ...prev,
  //     meilleur_eleve: student.id_eleve
  //   }))
  //   setValue('meilleur_eleve', student.id_eleve)
  // }

  useEffect(() => {
    if (classe) {
      reset({
        nom_classe: classe.nom_classe || "",
        niveau: classe.niveau || "",
        titulaire: classe.titulaire || "",
        delegue_1: Number(classe.delegue_1) ?? null,
        delegue_2: Number(classe.delegue_2) ?? null,
        meilleur_eleve: Number(classe.meilleur_eleve) ?? null,
      })
    } else {
      reset({
        nom_classe: '',
        niveau: '',
        delegue_1: null,
        delegue_2: null,
        meilleur_eleve: null,
        titulaire: ''
      })
    }
  }, [classe, reset])

  const onFormSubmit = handleSubmit((data: CreateClasse | UpdateClasse) => {
    onSubmit(data)
  })

  const resetForm = () => {
    reset()
    if (hiddeform) {
      hiddeform()
    }
  }
  
  return (
    <AlertDialog open={showform}>
      <AlertDialogTrigger asChild className='text-foreground'>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle classe
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className='text-foreground'>
            {classe ? "Modifier la classe" : "Ajouter une nouvelle classe"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {classe ? "Modifiez les informations de la classe ci-dessous." : "Remplissez les informations pour créer une nouvelle classe."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ScrollArea className="max-h-125 pr-4 text-foreground">
          <form id="classe-form" onSubmit={onFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nom_classe" className="text-sm font-medium">
                  Nom de la classe *
                </label>
                <Input
                  id="nom_classe"
                  placeholder="Ex: 6ème A"
                  {...register('nom_classe')}
                  className={errors.nom_classe ? 'border-red-500' : ''}
                />
                {errors.nom_classe && (
                  <p className="text-sm text-red-500">{errors.nom_classe.message}</p>
                )}
              </div>




              <div className="space-y-2">
                <label htmlFor="niveau" className="text-sm font-medium">
                  Niveau *
                </label>
                <Select value={watch("niveau")} onValueChange={(e)=>setValue("niveau", e)}>
                  <SelectTrigger className={errors.niveau ? 'border-red-500' : ''}>
                    <SelectValue id='niveau' placeholder="Choisit un Niveau scolaire"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Préscolaire'>Préscolaire</SelectItem>
                    <SelectItem value='Primaire'>Primaire</SelectItem>
                    <SelectItem value='Secondaire'>Secondaire</SelectItem>
                    <SelectItem value='Lycée'>Lycée</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Input
                  id="niveau"
                  placeholder="Ex: Primaire, Secondaire"
                  {...register('niveau')}
                  className={errors.niveau ? 'border-red-500' : ''}
                /> */}
                {errors.niveau && (
                  <p className="text-sm text-red-500">{errors.niveau.message}</p>
                )}
              </div>





              <div className="space-y-2">
                <label htmlFor="titulaire" className="text-sm font-medium">
                  Titulaire
                </label>
                <Input
                  id="titulaire"
                  placeholder="Nom du titulaire"
                  {...register('titulaire')}
                  className={errors.titulaire ? 'border-red-500' : ''}
                />
                {errors.titulaire && (
                  <p className="text-sm text-red-500">{errors.titulaire.message}</p>
                )}
              </div>

              {/* <div className='space-y-2'>
                  <label htmlFor="delegue_1" className="text-sm font-medium">
                    Delegue 1
                  </label>
                  <ElevePicker Click={handleDelegue1} currentStudent={classe ? classe.delegue_1?.toString() : ""} />
                  <Input
                    id="delegue_1"
                    placeholder="Nom du Delegue 1"
                    value={eleve.delegue_1}
                    {...register('delegue_1')}
                    className={errors.delegue_1 ? 'border-red-500 hidden' : 'hidden'}
                  />
                  {errors.delegue_1 && (
                    <p className="text-sm text-red-500">{errors.delegue_1.message}</p>
                  )}
              </div>

              <div className='space-y-2'>
                  <label htmlFor="delegue_2" className="text-sm font-medium">
                    Delegue 2
                  </label>
                  <ElevePicker Click={handleDelegue2} currentStudent={classe ? classe.delegue_2?.toString() : ""} />
                  <Input
                    id="delegue_2"
                    placeholder="Nom du Delegue 2"
                    value={eleve.delegue_2}
                    {...register('delegue_2')}
                    className={errors.delegue_2 ? 'border-red-500 hidden' : 'hidden'}
                  />
                  {errors.delegue_2 && (
                    <p className="text-sm text-red-500">{errors.delegue_2.message}</p>
                  )}
              </div>

              <div className='space-y-2'>
                  <label htmlFor="meilleur_eleve" className="text-sm font-medium">
                    Meilleur élève
                  </label>
                  <ElevePicker Click={handleBestof} currentStudent={classe ? classe.meilleur_eleve?.toString() : ""} />
                  <Input
                    id="meilleur_eleve"
                    placeholder="Nom du Meilleur élève"
                    value={eleve.meilleur_eleve}
                    {...register('meilleur_eleve')}
                    className={errors.meilleur_eleve ? 'border-red-500 hidden' : 'hidden'}
                  />
                  {errors.meilleur_eleve && (
                    <p className="text-sm text-red-500">{errors.meilleur_eleve.message}</p>
                  )}
              </div> */}




            </div>
          </form>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel className='text-foreground' onClick={resetForm}>Annuler</AlertDialogCancel>
          <Button 
            type="submit"
            form="classe-form"
            disabled={disabled || isLoading}
          >
            {isLoading ? "Enregistrement..." : submitButtonText}
          </Button>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}
