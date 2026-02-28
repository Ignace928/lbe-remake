import React from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/sonner'
import { ThemeToggle } from '@/components/ThemeToggle'

import '../styles/globals.css'
import { useThemeStore } from '@/store/themeStore'

// Composant wrapper pour initialiser le thème
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  useThemeStore.getState().applyCurrentTheme()
  return <>{children}</>
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer>
        <div className="relative min-h-screen bg-background text-foreground">
          {/* Bouton de changement de thème */}
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          <ScrollArea className='h-screen w-full'>
            <Component {...pageProps} />
          </ScrollArea>
          <Toaster />
        </div>
      </ThemeInitializer>
    </QueryClientProvider>
  )
}

export default MyApp
