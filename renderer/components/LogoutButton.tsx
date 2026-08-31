import React from 'react'
import { Button } from '@/components/ui/button'
import { useAnneeStore } from '@/store/anneStore'
import { LogOut } from 'lucide-react'
import { useAuthLogout } from '@/features/auth/auth_VModel'
<<<<<<< HEAD
import { useRouter } from 'next/router'
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default", 
  className = "",
  children 
}: LogoutButtonProps) {
  const { setAnne_active } = useAnneeStore()
  const logout = useAuthLogout()

  const handleLogout = () => {
    // Nettoyer les stores
    logout()
    setAnne_active({ id_anne: null, labelle: "" })
    
    // Rediriger vers la page de connexion
<<<<<<< HEAD
    // window.location.href = '/'
=======
    window.location.href = '/'
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleLogout}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </>
      )}
    </Button>
  )
}
