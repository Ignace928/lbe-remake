import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { User, CreateUser, UpdateUser, UserFieldErrors, createUserSchema, updateUserSchema } from '../user_types'

interface UserFormProps {
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
  size: "default" | "sm" | "lg" | "icon",
  style:string,
  trigger:string,
  onSubmit: (data: CreateUser | UpdateUser) => void
  user?: User | null
  isLoading?: boolean
  title: string
  description: string
  submitButtonText: string
}

export function UserForm({
  variant,
  size,
  style,
  trigger,
  onSubmit, 
  user, 
  isLoading = false, 
  title, 
  description, 
  submitButtonText 
}: UserFormProps) {
  const [formData, setFormData] = React.useState<CreateUser>({
    nom_user: user?.nom_user || '',
    mdp: '',
    role: user?.role || 'secretaire'
  })
  const [fieldErrors, setFieldErrors] = React.useState<UserFieldErrors>({})

  const validateField = (field: keyof CreateUser, value: any) => {
    const schema = user ? updateUserSchema : createUserSchema
    const result = schema.safeParse({ ...formData, [field]: value })
    
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === field)
      return fieldError ? [fieldError.message] : []
    }
    
    return []
  }

  const handleInputChange = (field: keyof CreateUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const errors = validateField(field, value)
    setFieldErrors(prev => ({ ...prev, [field]: errors }))
  }

  const handleSelectChange = (field: keyof CreateUser) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const errors = validateField(field, value)
    setFieldErrors(prev => ({ ...prev, [field]: errors }))
  }

  const validateForm = (): boolean => {
    const schema = user ? updateUserSchema : createUserSchema
    const result = schema.safeParse(formData)
    
    if (!result.success) {
      const errors: UserFieldErrors = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof CreateUser
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field]!.push(err.message)
      })
      setFieldErrors(errors)
      return false
    }
    
    setFieldErrors({})
    return true
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  React.useEffect(() => {
      setFormData({
        nom_user: user?.nom_user || '',
        mdp: '',
        role: user?.role || 'secretaire'
      })
      setFieldErrors({})
  }, [user])
  return (
    <AlertDialog>
      <AlertDialogTrigger className={`${buttonVariants({variant:`${variant}`, className:`${style}`, size:`${size}`})}`}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className='text-[#1A1A1D] text-2xl'>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className='text-[#252324] text-lg font-extralight'>
          {description}
        </AlertDialogDescription>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-[#1A1A1D]">Nom d'utilisateur</label>
            <Input
              value={formData.nom_user}
              onChange={handleInputChange('nom_user')}
              placeholder="Entrez le nom d'utilisateur"
              className={`text-[#181A18] font-medium ${fieldErrors.nom_user ? 'border-red-500' : ''}`}
            />
            {fieldErrors.nom_user && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.nom_user[0]}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-[#1A1A1D]">
              {user ? 'Nouveau mot de passe (laissez vide pour ne pas changer)' : 'Mot de passe'}
            </label>
            <Input
              type="password"
              value={formData.mdp}
              onChange={handleInputChange('mdp')}
              placeholder={user ? "Laissez vide pour ne pas modifier" : "Entrez le mot de passe"}
              className={`text-[#181A18] font-medium ${fieldErrors.mdp ? 'border-red-500' : ''}`}
            />
            {fieldErrors.mdp && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.mdp[0]}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-[#1A1A1D]">Rôle</label>
            <Select value={formData.role} onValueChange={handleSelectChange('role')}>
              <SelectTrigger className='text-[#181A18] font-medium'>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="professeur">Professeur</SelectItem>
                <SelectItem value="secretaire">Secrétaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({variant:'secondary'})}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit} 
            disabled={isLoading}
            className='rounded-full cursor-pointer'
          >
            {isLoading ? 'Traitement...' : submitButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
