import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useAnneeStore } from '@/store/anneStore'
import { LogOut } from 'lucide-react'

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
  const { setUser } = useAuthStore()
  const { setAnne_active } = useAnneeStore()

  const handleLogout = () => {
    // Nettoyer les stores
    setUser(null)
    setAnne_active({ id_anne: null, labelle: "" })
    
    // Nettoyer le localStorage
    localStorage.removeItem('user')
    
    // Rediriger vers la page de connexion
    window.location.href = '/'
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
