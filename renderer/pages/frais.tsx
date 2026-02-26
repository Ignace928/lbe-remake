import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftFromLineIcon, BadgeCheck, Wallet } from 'lucide-react'

export default function CashPage() {
  const fees = [
    { ref: 'PAY-4401', eleve: 'Amina Diallo', montant: '55 000 FCFA', statut: 'Paye', date: '22/02/2026' },
    { ref: 'PAY-4402', eleve: 'Noah Mendy', montant: '55 000 FCFA', statut: 'Partiel', date: '20/02/2026' },
    { ref: 'PAY-4403', eleve: 'Fatou Sarr', montant: '55 000 FCFA', statut: 'En retard', date: '18/02/2026' },
    { ref: 'PAY-4404', eleve: 'Lucas Ndao', montant: '55 000 FCFA', statut: 'Paye', date: '17/02/2026' },
  ]

  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/home'
  }

  return (
    <React.Fragment>
      <Head>
        <title>Frais - Nextron (with-tailwindcss)</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Frais & Scolarite'>
          <Button className='m-1 h-10 w-10 rounded-full' onClick={goHome}>
            <ArrowLeftFromLineIcon />
          </Button>
        </HeaderComponent>
      </div>

      <div className='app-page'>
        <section className='app-page-content'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            <Card className='border-white/20 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Recouvrements du mois</p>
              <p className='mt-2 text-3xl font-black text-white'>82%</p>
              <Progress value={82} className='mt-3' />
            </Card>
            <Card className='border-white/20 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Montant collecte</p>
              <div className='mt-2 flex items-center justify-between'>
                <p className='text-3xl font-black text-white'>2.4M</p>
                <Wallet className='h-6 w-6 text-emerald-200' />
              </div>
            </Card>
            <Card className='border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:col-span-2 xl:col-span-1'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Paiements valides</p>
              <div className='mt-2 flex items-center justify-between'>
                <p className='text-3xl font-black text-white'>124</p>
                <BadgeCheck className='h-6 w-6 text-cyan-200' />
              </div>
            </Card>
          </div>

          <Card className='border-white/20 bg-white/10 p-3 backdrop-blur-sm sm:p-4'>
            <div className='mb-3 flex flex-col gap-1 sm:mb-4'>
              <h1 className='text-2xl font-black tracking-tight text-white sm:text-3xl'>Paiements recents</h1>
              <p className='text-sm text-slate-200'>Historique des frais par etudiant</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className='border-white/15 hover:bg-white/5'>
                  <TableHead className='text-slate-300'>Reference</TableHead>
                  <TableHead className='text-slate-300'>Eleve</TableHead>
                  <TableHead className='text-slate-300'>Montant</TableHead>
                  <TableHead className='text-slate-300'>Date</TableHead>
                  <TableHead className='text-right text-slate-300'>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.ref} className='border-white/10 hover:bg-white/5'>
                    <TableCell className='font-mono text-xs text-slate-300 sm:text-sm'>{fee.ref}</TableCell>
                    <TableCell className='font-medium text-white'>{fee.eleve}</TableCell>
                    <TableCell className='text-slate-200'>{fee.montant}</TableCell>
                    <TableCell className='text-slate-200'>{fee.date}</TableCell>
                    <TableCell className='text-right'>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          fee.statut === 'Paye'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : fee.statut === 'Partiel'
                              ? 'bg-amber-500/20 text-amber-200'
                              : 'bg-red-500/20 text-red-200'
                        }`}
                      >
                        {fee.statut}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </div>
    </React.Fragment>
  )
}
