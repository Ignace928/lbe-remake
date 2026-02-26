import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { ArrowLeftFromLineIcon } from 'lucide-react'
import { useAnneeStore } from '@/store/anneStore'

export default function BoardPage() {
  const {anne_Active} = useAnneeStore()
  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/home'
  }

  return (
    <React.Fragment>
      <Head>
        <title>dashboard - Nextron (with-tailwindcss)</title>
      </Head>
        <div className='fixed top-0 z-20 w-full p-2'>
          <HeaderComponent title='Vue'>
            {/* <input className='border-gray-800/50 border rounded-full p-1 w-100 border-r-0'></input> */}
            <Button className='w-10 h-10 m-1 rounded-full' onClick={goHome}><ArrowLeftFromLineIcon/></Button>
          </HeaderComponent>
        </div>
        <div className='app-page'>
          <section className='app-page-content'>
            <Card className='p-4 border-amber-300'>
              <p className='text-2xl'>
                Tableau de bord {anne_Active.labelle}
              </p>
              <p className='text-2xl'>
                id : {anne_Active.id_anne}
              </p>
            </Card>
          </section>
        </div>
    </React.Fragment>
  )
}
