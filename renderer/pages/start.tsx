import React from 'react'
import Head from 'next/head'
import { HeaderComponent } from '@/components/layout/header'
import {
  Plus,
  Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MiniCard } from '@/components/miniCard'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useAnneeStore } from '@/store/anneStore'

export default function StarterPage() {
  const {setAnne_active, anne_Active} = useAnneeStore()
  const deconnection = () => {
    window.location.href = '/'
  }
  const go = () => {
    if (typeof window !== 'undefined') window.location.href = "/home"
  }
  const Add_annee = () => {
    alert("add année")
  }
  const menu = [
    {
      id_annee: 1,
      libelle: '2023-2024',
    },
    {
      id_annee: 2,
      libelle: '2024-2025',
    },
    {
      id_annee: 3,
      libelle: '2025-2026',
    },
  ]

  return (
    <React.Fragment>
      <Head>
        <title>Set Anne scolaire</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title="Get Started">
          <Button className='m-1 h-10 w-10 rounded-full' onClick={deconnection}>
            <Power />
          </Button>
        </HeaderComponent>
      </div>
      <main className='app-page'>
        <section className='app-page-content'>
          

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-5 lg:gap-5'>
            {menu.map((item) => (
                <Card
                  key={item.id_annee}
                  className='group h-full min-h-36 cursor-pointer border-lime-500/60 bg-white/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
                  onClick={()=>{
                    setAnne_active({
                      id_anne:item.id_annee,
                      labelle:item.libelle
                    })
                    go()
                  }}
                  role='button'
                  tabIndex={0}
                >
                  <CardContent className='flex flex-col items-center justify-center gap-3 p-4 sm:p-5'>
                    <span className='font-semibold text-slate-900'>{item.libelle}</span>
                    <div className='rounded-full bg-lime-100 p-2 text-lime-700 transition-colors group-hover:bg-lime-200'>
                      <Power className='h-5 w-5 sm:h-6 sm:w-6' />
                    </div>
                  </CardContent>
                  <CardDescription className='px-4 pb-4 text-left text-sm leading-relaxed text-slate-700 sm:px-5 sm:pb-5'>
                  </CardDescription>
                </Card>
            ))}
            <Card
                className='group h-full min-h-36 cursor-pointer border-2 border-dashed border-lime-500/60 bg-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
                onClick={Add_annee}
                role='button'
                tabIndex={0}
                >
                <CardContent className='flex items-center justify-center gap-3 p-4 sm:p-5'>
                    <div className='rounded-full p-2 text-secondary border border-dashed transition-colors group-hover:bg-lime-200 group-hover:text-lime-700'>
                        <Plus className='h-5 w-5 sm:h-6 sm:w-6' />
                    </div>
                    <span className='font-semibold text-slate-900'></span>
                </CardContent>
                <CardDescription className='px-4 pb-4 text-center text-sm leading-relaxed text-secondary sm:px-5 sm:pb-5'>
                    Nouvelle Année scolaire
                </CardDescription>
            </Card>
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}
