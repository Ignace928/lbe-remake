import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftFromLineIcon, Search } from 'lucide-react'

export default function EtudiantPage() {
  const students = [
    { id: 'STD-001', nom: 'Amina Diallo', classe: '6e A', etat: 'Actif', moyenne: '14.8/20' },
    { id: 'STD-002', nom: 'Noah Mendy', classe: '5e B', etat: 'Actif', moyenne: '13.1/20' },
    { id: 'STD-003', nom: 'Fatou Sarr', classe: '4e A', etat: 'En attente', moyenne: '12.6/20' },
    { id: 'STD-004', nom: 'Lucas Ndao', classe: '3e C', etat: 'Actif', moyenne: '15.2/20' },
  ]

  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/home'
  }

  return (
    <React.Fragment>
      <Head>
        <title>Eleves - Nextron (with-tailwindcss)</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Eleves'>
          <Button className='m-1 h-10 w-10 rounded-full' onClick={goHome}>
            <ArrowLeftFromLineIcon />
          </Button>
        </HeaderComponent>
      </div>

      <div className='app-page'>
        <section className='app-page-content'>
          <Card className='border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
              <div>
                <h1 className='text-2xl font-black tracking-tight text-white sm:text-3xl'>Suivi des etudiants</h1>
                <p className='mt-2 text-sm text-slate-200'>Consulte rapidement les informations principales.</p>
              </div>
              <div className='flex w-full items-center gap-2 lg:max-w-sm'>
                <div className='relative w-full'>
                  <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input className='border-white/20 bg-slate-900/50 pl-9 text-slate-100' placeholder='Rechercher un etudiant' />
                </div>
                <Button className='bg-cyan-400 text-slate-950 hover:bg-cyan-300'>Ajouter</Button>
              </div>
            </div>
          </Card>

          <Card className='border-white/20 bg-white/10 p-3 backdrop-blur-sm sm:p-4'>
            <Table>
              <TableHeader>
                <TableRow className='border-white/15 hover:bg-white/5'>
                  <TableHead className='text-slate-300'>ID</TableHead>
                  <TableHead className='text-slate-300'>Nom</TableHead>
                  <TableHead className='text-slate-300'>Classe</TableHead>
                  <TableHead className='text-slate-300'>Moyenne</TableHead>
                  <TableHead className='text-right text-slate-300'>Etat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className='border-white/10 hover:bg-white/5'>
                    <TableCell className='font-mono text-xs text-slate-300 sm:text-sm'>{student.id}</TableCell>
                    <TableCell className='font-medium text-white'>{student.nom}</TableCell>
                    <TableCell className='text-slate-200'>{student.classe}</TableCell>
                    <TableCell className='text-slate-200'>{student.moyenne}</TableCell>
                    <TableCell className='text-right'>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          student.etat === 'Actif' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
                        }`}
                      >
                        {student.etat}
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
