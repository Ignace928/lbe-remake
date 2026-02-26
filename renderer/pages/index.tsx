import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import LoadingPage from '@/components/loadingPage'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import { useLoginMutation } from '@/features/auth/auth_VModel'
import { LoginCredentials, LoginFieldErrors, loginSchema } from '@/features/auth/auth_types'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import { ConfigurationPage } from '@/features/auth/view/ConfigurationPage'

export default function NextPage() {
  const {setAnne_active} = useAnneeStore()
  const { setUser } = useAuthStore()
  const loginMutation = useLoginMutation()
  const { data, isLoading, error:err } = useDatabaseStatusQuery()
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    nom_user: '',
    mdp: ''
  })
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setAnne_active({id_anne: null, labelle: ""})
    
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUser(user)
        // Redirection selon le rôle
        if (user.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/start'
        }
      } catch (error) {
        console.error('Erreur lors de la lecture de l\'utilisateur stocké:', error)
        // Nettoyer le localStorage corrompu
        localStorage.removeItem('user')
      }
    }
  }, [])

  const validateField = (field: keyof LoginCredentials, value: string) => {
    const result = loginSchema.safeParse({ ...credentials, [field]: value })
    
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === field)
      return fieldError ? [fieldError.message] : []
    }
    
    return []
  }

  const handleInputChange = (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Validation en temps réel du champ
    const errors = validateField(field, value)
    setFieldErrors(prev => ({
      ...prev,
      [field]: errors
    }))
    
    // Effacer l'erreur générale lors de la saisie
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse(credentials)
    
    if (!result.success) {
      const errors: LoginFieldErrors = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof LoginCredentials
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation Zod du formulaire complet
    if (!validateForm()) {
      return
    }

    try {
      const result = await loginMutation.mutateAsync(credentials)
      
      if (result.success && result.data) {
        setUser(result.data)
        localStorage.setItem('user', JSON.stringify(result.data))
        
        // Redirection immédiate selon le rôle
        if (result.data.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/start'
        }
      } else {
        // Si le backend renvoie success=false avec un message de succès, c'est une erreur de logique
        if (result.message && result.message.toLowerCase().includes('réussi')) {
          // Forcer la redirection si le message indique un succès mais success=false
          setError('')
          if (result.data) {
            setUser(result.data)
            localStorage.setItem('user', JSON.stringify(result.data))
            if (result.data.role === 'admin') {
              window.location.href = '/admin'
            } else {
              window.location.href = '/start'
            }
          }
        } else {
          setError(result.message || 'Erreur lors de la connexion')
        }
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.')
    }
  }

  // Afficher le chargement pendant la vérification de la base de données
  if (isLoading) {
    return <LoadingPage size={40} />
  }

  // Afficher la configuration si la base de données n'est pas initialisée
  if (!data || !data.initialized) {
    return (<ConfigurationPage description={data.message}/>)
  }

  return (
    <React.Fragment>
      <Head>
        <title>Se connecter - LBE Schoolar✨</title>
      </Head>
      
      <ScrollArea className="p-4 space-y-6 h-screen">
        <CardContent className="flex items-center justify-center min-h-full">
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
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label htmlFor="nom_user" className="text-sm font-medium">
                    Nom d'utilisateur
                  </label>
                  <Input
                    id="nom_user"
                    type="text"
                    value={credentials.nom_user}
                    onChange={handleInputChange('nom_user')}
                    placeholder="Entrez votre nom d'utilisateur"
                    className={`mt-2 ${fieldErrors.nom_user ? 'border-red-500' : 'border-primary/50'}`}
                    disabled={loginMutation.isPending}
                  />
                  {fieldErrors.nom_user && (
                    <p className="text-sm text-red-600">
                      {fieldErrors.nom_user[0]}
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
                    value={credentials.mdp}
                    onChange={handleInputChange('mdp')}
                    placeholder="Entrez votre mot de passe"
                    className={`mt-2 ${fieldErrors.mdp ? 'border-red-500' : 'border-primary/50'}`}
                    disabled={loginMutation.isPending}
                  />
                  {fieldErrors.mdp && (
                    <p className="text-sm text-red-600">
                      {fieldErrors.mdp[0]}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </CardContent>
      </ScrollArea>
    </React.Fragment>
  )
}
