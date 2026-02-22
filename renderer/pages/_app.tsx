import React from 'react'
import type { AppProps } from 'next/app'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/sonner'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ScrollArea className='h-screen w-full'>
        <Component {...pageProps} />
      </ScrollArea>
      <Toaster />
    </>
  )
}

export default MyApp
