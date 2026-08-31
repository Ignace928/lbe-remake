import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon } from 'lucide-react'
import { useAnneeStore } from '@/store/anneStore'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function BoardPage() {
  const {anne_Active} = useAnneeStore()
  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/home'
  }

  return (
    <React.Fragment>
      <Head>
        <title>Tableau de bord - LBE Schoolar</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Vue globale'>
          <Button className='w-10 h-10 m-1 rounded-full' onClick={goHome}>
            <ArrowLeftFromLineIcon/>
          </Button>
        </HeaderComponent>
      </div>
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'>
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary'>
                  <ArrowLeftFromLineIcon className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Tableau de bord</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {anne_Active.labelle}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  ID: {anne_Active.id_anne}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Statistiques</p>
                <p className='mt-2 text-2xl font-bold text-foreground'>Vue d'ensemble</p>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Performance</p>
                <p className='mt-2 text-2xl font-bold text-foreground'>En cours</p>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Activité</p>
                <p className='mt-2 text-2xl font-bold text-foreground'>Récente</p>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Système</p>
                <p className='mt-2 text-2xl font-bold text-foreground'>Opérationnel</p>
              </Card>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
