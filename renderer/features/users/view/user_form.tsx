import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CreateUser, UpdateUser, UserFieldErrors, createUserSchema, updateUserSchema, User } from '../user_types'

interface UserFormProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  style?: string
  trigger?: React.ReactNode
  onSubmit: (data: CreateUser | UpdateUser) => void
  user?: User | CreateUser | UpdateUser | null
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
  showform?:boolean
  hiddeform?:()=>void
  disabled?: boolean
}

export function UserForm({
  trigger,
  onSubmit,
  user,
  isLoading = false,
  title,
  description,
  submitButtonText = "Enregistrer",
  showform,
  hiddeform,
  disabled = false
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateUser | UpdateUser>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues: user || {
      nom_user: '',
      mdp: '',
      role: 'secretaire'
    }
  })

  // Synchroniser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const onFormSubmit = (data: CreateUser | UpdateUser) => {
    onSubmit(data)
    reset({
      nom_user: '',
      mdp: '',
      role: 'secretaire'
    })
    hiddeform()
  }
  const handleCancel = () => {
    reset({
      nom_user: '',
      mdp: '',
      role: 'secretaire'
    })
    hiddeform()
  }
  
  const isNecroUser = user && 'id_user' in user && user.id_user === 1;
  return (
    <AlertDialog open={showform}>
      <AlertDialogTrigger>
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
            <label className="text-sm font-medium">Nom d'utilisateur</label>
            <Input
              {...register('nom_user')}
              placeholder="Entrez le nom d'utilisateur"
              className={`font-medium ${errors.nom_user ? 'border-red-500' : ''}`}
            />
            {errors.nom_user && (
              <p className="text-sm text-red-600 mt-1">{errors.nom_user.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              {...register('mdp')}
              type="password"
              placeholder="Entrez le mot de passe"
              className={`font-medium ${errors.mdp ? 'border-red-500' : ''}`}
            />
            {errors.mdp && (
              <p className="text-sm text-red-600 mt-1">{errors.mdp.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Rôle</label>
            <Select 
              {...register('role')}
              onValueChange={(value) => setValue('role', value as 'admin' | 'professeur' | 'secretaire')}
              defaultValue={isNecroUser ? 'admin' : 'secretaire'}
              disabled={isNecroUser}
            >
              <SelectTrigger className='font-medium'>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="professeur">Professeur</SelectItem>
                <SelectItem value="secretaire">Secrétaire</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
            )}
            {isNecroUser && (
              <p className="text-sm text-amber-600 mt-1">🔒 Le rôle de cet utilisateur est toujours administrateur</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} className={buttonVariants({ variant: 'secondary' })}>
              Fermer
            </AlertDialogCancel>
            <Button 
              type="submit" 
              disabled={isLoading}
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
