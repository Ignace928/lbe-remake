import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { CreateEleve, UpdateEleve, createEleveSchema, updateEleveSchema } from '../eleve_types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IdCard, IdCardLanyard, Pen } from 'lucide-react'

interface EleveFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data: CreateEleve | UpdateEleve) => void
  eleve?: CreateEleve | UpdateEleve | null
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
  disabled?: boolean
  isFirstStudent?: boolean // Pour savoir si c'est le premier étudiant
}

export function EleveForm({
  // variant = "default",
  // size = "default",
  // style = "",
  trigger,
  onSubmit,
  eleve,
  isLoading = false,
  submitButtonText = "Enregistrer",
  disabled = false,
  isFirstStudent = false
}: EleveFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateEleve | UpdateEleve>({
    resolver: zodResolver(eleve ? updateEleveSchema : createEleveSchema),
    defaultValues: eleve || {
      nom_eleve: '',
      post_nom_eleve: '',
      sexe: 'M',
      date_naissance: new Date().toISOString().split('T')[0], // Date du jour au format YYYY-MM-DD
      lieu_naissance: '',
      nationalite: '',
      adresse: '',
      telephone: '',
      email: 'x@gmail.com',
      nom_pere: '',
      nom_mere: '',
      profession_pere: '',
      profession_mere: '',
      etat: 'Actif',
      maladie: '',
      taille: 0
    }
  })

  // Synchroniser le formulaire avec les données de l'élève
  useEffect(() => {
    if (eleve) {
      reset(eleve)
    }
  }, [eleve, reset])

  // Le matricule est généré côté backend, pas besoin de le générer ici

  const onFormSubmit = (data: CreateEleve | UpdateEleve) => {
    
    onSubmit(data)
    if (!eleve) {
      // Réinitialiser seulement pour la création
      reset({
        nom_eleve: '',
        post_nom_eleve: '',
        sexe: 'M',
        date_naissance: new Date().toISOString().split('T')[0], // Date du jour au format YYYY-MM-DD
        lieu_naissance: '',
        nationalite: '',
        adresse: '',
        telephone: '',
        email: 'x@gmail.com',
        nom_pere: '',
        nom_mere: '',
        profession_pere: '',
        profession_mere: '',
        etat: 'Actif',
        maladie: '',
        taille: 0
      })
    }
    
  }

  // Si trigger est null, afficher directement le contenu, sinon utiliser AlertDialog
  if (trigger === null) {
    return (
            <div className='pt-5'>
        
                <form onSubmit={handleSubmit(onFormSubmit)} id="eleve" className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Champ ID (uniquement pour le premier étudiant) */}
                    {isFirstStudent && !eleve && (
                        <div className="space-y-2">
                        <label className="text-sm font-medium">ID Élève *</label>
                        <Input
                            {...register('id_eleve', { valueAsNumber: true })}
                            type="number"
                            placeholder="Numéro d'identification unique"
                            className={`font-medium ${errors.id_eleve ? 'border-red-500' : ''}`}
                        />
                        <p className="text-xs text-muted-foreground">
                            Ce champ n'apparaît que pour le premier étudiant
                        </p>
                        {errors.id_eleve && (
                            <p className="text-sm text-red-600 mt-1">{errors.id_eleve.message}</p>
                        )}
                        </div>
                    )}

                    {/* Matricule (généré automatiquement côté backend) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Matricule</label>
                        <Input
                        value={(eleve && 'matricule' in eleve ? eleve.matricule : "Généré automatiquement") as string}
                        readOnly
                        className="font-medium bg-muted/50 border-muted-foreground/30 cursor-not-allowed"
                        placeholder="Généré automatiquement"
                        />
                        <p className="text-xs text-muted-foreground">
                        Format: ID+Sexe/AA (ex: 123M/24) - Généré automatiquement lors de la création
                        </p>
                    </div>

                    {/* Nom */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom *</label>
                        <Input
                        {...register('nom_eleve')}
                        placeholder="Nom de l'élève"
                        className={`font-medium ${errors.nom_eleve ? 'border-red-500 animate-pulse' : 'border border-sidebar-primary'}`}
                        />
                        {errors.nom_eleve && (
                        <p className="text-sm text-red-600 mt-1">{errors.nom_eleve.message}</p>
                        )}
                    </div>

                    {/* Post-nom */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prénoms</label>
                        <Input
                        {...register('post_nom_eleve')}
                        placeholder="Prénoms de l'élève"
                        className={`font-medium ${errors.post_nom_eleve ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.post_nom_eleve && (
                        <p className="text-sm text-red-600 mt-1">{errors.post_nom_eleve.message}</p>
                        )}
                    </div>

                    {/* Sexe */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sexe *</label>
                        <Select value={watch('sexe')} onValueChange={(value) => setValue('sexe', value as 'M' | 'F')}>
                        <SelectTrigger className={`font-medium ${errors.sexe ? 'border-red-500' : 'border border-sidebar-primary'}`}>
                            <SelectValue placeholder="Sélectionner le sexe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="M">Masculin</SelectItem>
                            <SelectItem value="F">Féminin</SelectItem>
                        </SelectContent>
                        </Select>
                        {errors.sexe && (
                        <p className="text-sm text-red-600 mt-1">{errors.sexe.message}</p>
                        )}
                    </div>

                    {/* Date de naissance */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date de naissance *</label>
                        <DatePicker
                        value={watch('date_naissance')}
                        onChange={(date) => setValue('date_naissance', date)}
                        placeholder="Sélectionner la date de naissance"
                        className={`font-medium ${errors.date_naissance ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.date_naissance && (
                        <p className="text-sm text-red-600 mt-1">{errors.date_naissance.message}</p>
                        )}
                    </div>

                    {/* Lieu de naissance */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lieu de naissance</label>
                        <Input
                        {...register('lieu_naissance')}
                        placeholder="Lieu de naissance"
                        className={`font-medium ${errors.lieu_naissance ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.lieu_naissance && (
                        <p className="text-sm text-red-600 mt-1">{errors.lieu_naissance.message}</p>
                        )}
                    </div>

                    {/* Nationalité */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nationalité</label>
                        <Input
                        {...register('nationalite')}
                        placeholder="Nationalité"
                        className={`font-medium ${errors.nationalite ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.nationalite && (
                        <p className="text-sm text-red-600 mt-1">{errors.nationalite.message}</p>
                        )}
                    </div>

                    {/* Adresse */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Adresse</label>
                        <Input
                        {...register('adresse')}
                        placeholder="Adresse complète"
                        className={`font-medium ${errors.adresse ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.adresse && (
                        <p className="text-sm text-red-600 mt-1">{errors.adresse.message}</p>
                        )}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Téléphone</label>
                        <Input
                        {...register('telephone')}
                        placeholder="Numéro de téléphone"
                        className={`font-medium ${errors.telephone ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.telephone && (
                        <p className="text-sm text-red-600 mt-1">{errors.telephone.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                        {...register('email')}
                        type="email"
                        placeholder="Adresse email"
                        className={`font-medium ${errors.email ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Nom du père */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom du père</label>
                        <Input
                        {...register('nom_pere')}
                        placeholder="Nom du père"
                        className={`font-medium ${errors.nom_pere ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.nom_pere && (
                        <p className="text-sm text-red-600 mt-1">{errors.nom_pere.message}</p>
                        )}
                    </div>

                    {/* Nom de la mère */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom de la mère</label>
                        <Input
                        {...register('nom_mere')}
                        placeholder="Nom de la mère"
                        className={`font-medium ${errors.nom_mere ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.nom_mere && (
                        <p className="text-sm text-red-600 mt-1">{errors.nom_mere.message}</p>
                        )}
                    </div>

                    {/* Profession du père */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profession du père</label>
                        <Input
                        {...register('profession_pere')}
                        placeholder="Profession du père"
                        className={`font-medium ${errors.profession_pere ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.profession_pere && (
                        <p className="text-sm text-red-600 mt-1">{errors.profession_pere.message}</p>
                        )}
                    </div>

                    {/* Profession de la mère */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profession de la mère</label>
                        <Input
                        {...register('profession_mere')}
                        placeholder="Profession de la mère"
                        className={`font-medium ${errors.profession_mere ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.profession_mere && (
                        <p className="text-sm text-red-600 mt-1">{errors.profession_mere.message}</p>
                        )}
                    </div>

                    {/* État */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">État *</label>
                        <Select value={watch('etat')} onValueChange={(value) => setValue('etat', value as 'Actif' | 'Inactif')}>
                        <SelectTrigger className={`font-medium ${errors.etat ? 'border-red-500' : 'border border-sidebar-primary'}`}>
                            <SelectValue placeholder="Sélectionner l'état" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Actif">Actif</SelectItem>
                            <SelectItem value="Inactif">Inactif</SelectItem>
                        </SelectContent>
                        </Select>
                        {errors.etat && (
                        <p className="text-sm text-red-600 mt-1">{errors.etat.message}</p>
                        )}
                    </div>

                    {/* Maladie */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Maladie chronique</label>
                        <Input
                        {...register('maladie')}
                        placeholder="Maladie chronique (si applicable)"
                        className={`font-medium ${errors.maladie ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.maladie && (
                        <p className="text-sm text-red-600 mt-1">{errors.maladie.message}</p>
                        )}
                    </div>

                    {/* Taille */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Taille (cm)</label>
                        <Input
                        {...register('taille', { valueAsNumber: true })}
                        type="number"
                        placeholder="Taille en cm"
                        className={`font-medium ${errors.taille ? 'border-red-500' : 'border border-sidebar-primary'}`}
                        />
                        {errors.taille && (
                        <p className="text-sm text-red-600 mt-1">{errors.taille.message}</p>
                        )}
                    </div>
                    </div>


                </form>
                <section className='fixed bottom-0 w-full bg-card p-4 left-0 flex justify-end '>
                    <Button 
                        type="submit" 
                        form='eleve'
                        disabled={isLoading || disabled}
                        className={`rounded-full cursor-pointer ${eleve && "bg-amber-500 text-black hover:bg-amber-400"}`}
                    >
                        {isLoading ? 'Traitement...' : submitButtonText}
                        {
                            eleve?(<Pen/>):(<IdCardLanyard/>)
                        }
                    </Button>
                </section>
        </div>
    )
  }

}
