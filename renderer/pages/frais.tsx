import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftFromLineIcon, BadgeCheck, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

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
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'>
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary'>
                  <Wallet className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Gestion des frais & scolarité</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {fees.length} paiement{(fees.length || 0) > 1 ? 's' : ''} enregistré{(fees.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  {fees.filter(f => f.statut === 'Paye').length} payés
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6'>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Recouvrements du mois</p>
                <p className='mt-2 text-3xl font-black text-foreground'>82%</p>
                <Progress value={82} className='mt-3' />
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Montant collecté</p>
                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-3xl font-black text-foreground'>2.4M</p>
                  <Wallet className='h-6 w-6 text-primary' />
                </div>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Paiements valides</p>
                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-3xl font-black text-foreground'>124</p>
                  <BadgeCheck className='h-6 w-6 text-primary' />
                </div>
              </Card>
            </div>
            <div className='mb-4 flex flex-col gap-1'>
              <h1 className='text-2xl font-black tracking-tight text-foreground sm:text-3xl'>Paiements récents</h1>
              <p className='text-sm text-muted-foreground'>Historique des frais par étudiant</p>
            </div>
            <div className='rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
              <Table>
                <TableHeader>
                  <TableRow className='border-primary/10 hover:bg-primary/5'>
                    <TableHead className='text-foreground'>Reference</TableHead>
                    <TableHead className='text-foreground'>Eleve</TableHead>
                    <TableHead className='text-foreground'>Montant</TableHead>
                    <TableHead className='text-foreground'>Date</TableHead>
                    <TableHead className='text-right text-foreground'>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.ref} className='border-primary/10 hover:bg-primary/5'>
                      <TableCell className='font-mono text-xs text-muted-foreground sm:text-sm'>{fee.ref}</TableCell>
                      <TableCell className='font-medium text-foreground'>{fee.eleve}</TableCell>
                      <TableCell className='text-muted-foreground'>{fee.montant}</TableCell>
                      <TableCell className='text-muted-foreground'>{fee.date}</TableCell>
                      <TableCell className='text-right'>
                        <Badge
                          variant='outline'
                          className={`border-2 ${
                            fee.statut === 'Paye'
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-700'
                              : fee.statut === 'Partiel'
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-700'
                                : 'bg-red-500/20 border-red-500/50 text-red-700'
                          }`}
                        >
                          {fee.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
