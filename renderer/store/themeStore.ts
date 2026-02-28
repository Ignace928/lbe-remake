import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { themes, type ThemeKey, applyThemeVars } from '@/lib/themes'

interface ThemeStore {
  // État actuel
  currentTheme: ThemeKey
  isDark: boolean
  
  // Actions
  setTheme: (theme: ThemeKey) => void
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
  
  // Utilitaires
  getCurrentThemeVars: () => Record<string, string>
  applyCurrentTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentTheme: '6', // Thème par défaut
      isDark: false,
      
      // Changer de thème
      setTheme: (theme: ThemeKey) => {
        set({ currentTheme: theme })
        get().applyCurrentTheme()
      },
      
      // Basculer mode sombre/clair
      toggleDarkMode: () => {
        const newIsDark = !get().isDark
        set({ isDark: newIsDark })
        get().applyCurrentTheme()
      },
      
      // Définir le mode sombre/clair
      setDarkMode: (isDark: boolean) => {
        set({ isDark })
        get().applyCurrentTheme()
      },
      
      // Obtenir les variables CSS du thème actuel
      getCurrentThemeVars: () => {
        const { currentTheme, isDark } = get()
        const theme = themes[currentTheme]
        return isDark ? theme.dark : theme.light
      },
      
      // Appliquer le thème actuel au DOM
      applyCurrentTheme: () => {
        const vars = get().getCurrentThemeVars()
        applyThemeVars(vars)
        
        // Ajouter/retirer la classe 'dark' sur l'élément html
        const root = document.documentElement
        if (get().isDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Appliquer le thème après réhydratation
        if (state) {
          state.applyCurrentTheme()
        }
      }
    }
  )
)

// Selecteurs pour un accès facile
export const useCurrentTheme = () => useThemeStore((state) => state.currentTheme)
export const useIsDark = () => useThemeStore((state) => state.isDark)
export const useThemeActions = () => useThemeStore((state) => ({
  setTheme: state.setTheme,
  toggleDarkMode: state.toggleDarkMode,
  setDarkMode: state.setDarkMode
}))
