import React, { useEffect } from 'react'
import Head from 'next/head'
import { ScrollArea } from '@/components/ui/scroll-area'
import LoadingPage from '@/components/loadingPage'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import { useLoginMutation } from '@/features/auth/auth_VModel'
import { LoginCredentials } from '@/features/auth/auth_types'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import { ConfigurationPage } from '@/features/auth/view/ConfigurationPage'
import { AuthForm } from '@/features/auth/view/AuthForm'
import { getUserById } from '@/features/users/user_service'
import { BackendUserResponse, UserWithoutPassword } from '@/features/users/user_types'
import { CardContent } from '@/components/ui/card'

export default function NextPage() {
  const { setAnne_active } = useAnneeStore()
  const { user, hasHydrated, setUser } = useAuthStore()
  const loginMutation = useLoginMutation()
  const { data, isLoading, error: dbError } = useDatabaseStatusQuery()

  // Réinitialiser l'année active au démarrage
  useEffect(() => {
    setAnne_active({ id_anne: null, labelle: "" })
  }, [])

  // Validation et redirection automatique si utilisateur déjà connecté
  useEffect(() => {
    if (!hasHydrated) return // Attendre l'hydratation du store

    const validateAndRedirect = async () => {
      if (user) {
        try {
          // 🔒 VALIDATION CÔTÉ SERVEUR : vérifier que l'utilisateur existe vraiment
          const userValidation: BackendUserResponse = await getUserById(user.id_user)
          
          if (userValidation.success && userValidation.data) {
            const backendUser = userValidation.data
            
            // 🔒 Conversion des données du backend vers le type UserWithoutPassword
            const validUser: UserWithoutPassword = {
              id_user: typeof backendUser.id_user === 'string' 
                ? parseInt(backendUser.id_user) 
                : backendUser.id_user,
              nom_user: backendUser.nom_user,
              role: backendUser.role as 'admin' | 'professeur' | 'secretaire'
            }
            
            // 🔒 Vérifier que le nom d'utilisateur correspond
            if (validUser.nom_user === user.nom_user) {
              // Redirection selon le rôle VALIDÉ
              const redirectUrl = validUser.role === 'admin' ? '/admin' : 
                                 validUser.role === 'secretaire' ? '/start' : 
                                 '/start'
              
              // Mettre à jour le store avec les données validées
              setUser(validUser)
              
              window.location.href = redirectUrl
            } else {
              // ❌ Nom d'utilisateur ne correspond pas -> déconnexion
              console.error('Session falsifiée: nom utilisateur invalide')
              setUser(null)
            }
          } else {
            // ❌ Utilisateur n'existe pas -> déconnexion
            console.error('Session falsifiée: utilisateur inexistant')
            setUser(null)
          }
        } catch (error) {
          // ❌ Erreur de validation -> déconnexion
          console.error('Erreur validation session:', error)
          setUser(null)
        }
      }
    }

    validateAndRedirect()
  }, [user, hasHydrated, setUser])

  const handleSubmit = async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials)
      
      if (result.success && result.data) {
        // La redirection se fera automatiquement via le useEffect ci-dessus
        // quand le store sera mis à jour avec les données validées
      } else {
        // Gérer les erreurs ici si nécessaire
        console.error('Login failed:', result.message)
      }
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  // Afficher le chargement pendant la vérification de la base de données et l'hydratation
  if (isLoading || !hasHydrated) {
    return <LoadingPage size={40} />
  }

  // Afficher la configuration si la base de données n'est pas initialisée
  if (!data || !data.initialized) {
    return <ConfigurationPage description={data?.message} />
  }

  // Si l'utilisateur est connecté mais en cours de validation
  if (user) {
    return <LoadingPage size={40} /> // En attente de validation et redirection
  }

  return (
    <React.Fragment>
      <Head>
        <title>Se connecter - LBE Schoolar✨</title>
      </Head>
      
      <ScrollArea className="p-4 space-y-6 h-screen">
        <CardContent className="flex items-center justify-center min-h-full">
          <AuthForm 
            onSubmit={handleSubmit}
            isLoading={loginMutation.isPending}
            error={loginMutation.error ? 'Erreur de connexion. Veuillez réessayer.' : undefined}
          />
        </CardContent>
      </ScrollArea>
    </React.Fragment>
  )
}
