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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { HeaderComponent } from '@/components/layout/header'

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
            
            // 🔒 Conversion sécurisée des données du backend vers le type UserWithoutPassword
            const validUser: UserWithoutPassword = {
              id_user: typeof backendUser.id_user === 'string' 
                ? parseInt(backendUser.id_user, 10) 
                : backendUser.id_user,
              nom_user: backendUser.nom_user,
              role: backendUser.role as 'admin' | 'professeur' | 'secretaire'
            }
            
            // 🔒 Vérifier que le nom d'utilisateur correspond (plus tolérant)
            if (validUser.nom_user && user.nom_user && 
                validUser.nom_user.trim().toLowerCase() === user.nom_user.trim().toLowerCase()) {
              // Mettre à jour le store avec les données validées
              setUser(validUser)
              
              // Redirection selon le rôle VALIDÉ (avec délai pour éviter les problèmes de race condition)
              const redirectUrl = validUser.role === 'admin' ? '/admin' : 
                                 validUser.role === 'secretaire' ? '/start' : 
                                 '/start'
              
              setTimeout(() => {
                window.location.href = redirectUrl
              }, 100)
            } else {
              // ❌ Nom d'utilisateur ne correspond pas -> déconnexion
              console.error('Session falsifiée: nom utilisateur invalide', { 
                expected: user.nom_user, 
                got: validUser.nom_user,
                expectedType: typeof user.nom_user,
                gotType: typeof validUser.nom_user
              })
              setUser(null)
            }
          } else {
            // ❌ Utilisateur n'existe pas -> déconnexion
            setUser(null)
          }
        } catch (error) {
          // ❌ Erreur de validation -> déconnexion
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
        // // quand le store sera mis à jour avec les données validées
        // console.log('Login successful, waiting for validation and redirect...')
        toast.success('Connecté avec sucess✔')
      } else {
        // Gérer les erreurs ici si nécessaire
        toast.error(result.message)
        // Afficher un message d'erreur à l'utilisateur si nécessaire
      }
    } catch (err) {
      toast.error(err)
      // Afficher un message d'erreur à l'utilisateur si nécessaire
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
        <title>Page de connection</title>
      </Head>
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
          <HeaderComponent title='Lycée Benjamin Escande'></HeaderComponent>
        </header>
        
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex items-center justify-center h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
            
              <AuthForm 
                onSubmit={handleSubmit}
                isLoading={loginMutation.isPending}
                error={loginMutation.error ? 'Erreur de connexion. Veuillez réessayer.' : undefined}
              />
          </Card>
        </main>
      </div>
    </React.Fragment>
  )
}
