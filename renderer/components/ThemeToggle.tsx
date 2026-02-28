import React, { useState } from 'react'
import { Moon, Sun, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useThemeStore, useCurrentTheme, useIsDark, useThemeActions } from '@/store/themeStore'
import { type ThemeKey, themes } from '@/lib/themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Noms des thèmes pour l'affichage
const themeNames: Record<ThemeKey, string> = {
  '1': 'Vert Forêt',
  '2': 'Jaune Soleil',
  '3': 'Rouge Feu',
  '4': 'Bleu Océan',
  '5': 'Gris Argile',
  '6': 'Défaut'
}

export function ThemeToggle() {
  const currentTheme = useCurrentTheme()
  const isDark = useIsDark()
  const { setTheme, toggleDarkMode } = useThemeActions()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeSelect = (theme: ThemeKey) => {
    setTheme(theme)
    setIsOpen(false)
  }

  const handleToggleDark = () => {
    toggleDarkMode()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* Toggle Mode Sombre/Clair */}
        <DropdownMenuItem onClick={handleToggleDark}>
          <div className="flex items-center gap-2 flex-1">
            {isDark ? (
              <>
                <Sun className="h-4 w-4" />
                <span>Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span>Mode Sombre</span>
              </>
            )}
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Sélection du thème */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-2 flex-1">
              <Palette className="h-4 w-4" />
              <span>Thème Couleur</span>
            </div>
          </DropdownMenuSubTrigger>
          
          <DropdownMenuSubContent className="w-48">
            {Object.entries(themeNames).map(([key, name]) => {
              const themeKey = key as ThemeKey
              const isActive = currentTheme === themeKey
              
              return (
                <DropdownMenuItem
                  key={themeKey}
                  onClick={() => handleThemeSelect(themeKey)}
                  className="flex items-center gap-2"
                >
                  {/* Indicateur de thème actif */}
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/30'
                  }`} />
                  
                  {/* Aperçu des couleurs du thème */}
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ 
                        backgroundColor: `var(--chart-1, ${themes[themeKey].light['--chart-1']})` 
                      }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ 
                        backgroundColor: `var(--chart-2, ${themes[themeKey].light['--chart-2']})` 
                      }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ 
                        backgroundColor: `var(--primary, ${themes[themeKey].light['--primary']})` 
                      }}
                    />
                  </div>
                  
                  <span className="flex-1">{name}</span>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        {/* Informations sur le thème actuel */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Actuel:</span>
            <span className="font-medium">{themeNames[currentTheme]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Mode:</span>
            <span className="font-medium">{isDark ? 'Sombre' : 'Clair'}</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
