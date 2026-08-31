import React, { useState } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/sonner'

import '../styles/globals.css'
import ThemeProvider from '@/providers/themeProvider'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>

      <ThemeProvider>
        <Toaster 
<<<<<<< HEAD
          position="top-center"
=======
          position="top-left"
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
          expand={true}
          richColors
          toastOptions={{
            classNames: {
              // Seulement l'icône change de couleur selon le type
              success: '[&>svg]:text-green-500',
              error: '[&>svg]:text-red-500',
              info: '[&>svg]:text-blue-500',
              loading: '[&>svg]:text-yellow-500',
            }
          }}
        />
        <div className={`relative min-h-screen transition-all bg-background`}>
          <ScrollArea className='h-screen w-full  duration-400'>
            <Component {...pageProps} />
          </ScrollArea>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
