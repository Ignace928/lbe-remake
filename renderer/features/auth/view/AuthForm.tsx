import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, LoginCredentials } from '../auth_types'

interface AuthFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  isLoading?: boolean
  error?: string
}

export function AuthForm({ onSubmit, isLoading = false, error }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  return (
    <Card className="w-full max-w-md m-4">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <p className="text-sm text-muted-foreground">
          Entrez vos identifiants pour accéder à l'application
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="nom_user" className="text-sm font-medium">
              Nom d'utilisateur
            </label>
            <Input
              id="nom_user"
              type="text"
              {...register('nom_user')}
              placeholder="Entrez votre nom d'utilisateur"
              className={`mt-2 ${errors.nom_user ? 'border-red-500' : 'border-primary/50'}`}
              disabled={isLoading}
            />
            {errors.nom_user && (
              <p className="text-sm text-red-600">
                {errors.nom_user.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="mdp" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="mdp"
              type="password"
              {...register('mdp')}
              placeholder="Entrez votre mot de passe"
              className={`mt-2 ${errors.mdp ? 'border-red-500' : 'border-primary/50'}`}
              disabled={isLoading}
            />
            {errors.mdp && (
              <p className="text-sm text-red-600">
                {errors.mdp.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
