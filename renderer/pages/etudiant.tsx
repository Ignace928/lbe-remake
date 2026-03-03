import React from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftFromLineIcon, Search, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

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
      <div className='app-page fixed w-full h-screen overflow-hidden pt-15'>
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary'>
                  <Users className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Suivi des étudiants</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {students.length} étudiant{(students.length || 0) > 1 ? 's' : ''} inscrit{(students.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  {students.filter(s => s.etat === 'Actif').length} actifs
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <div className='rounded-full bg-gradient-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
                    <Search className='h-4 w-4 text-primary-foreground' />
                  </div>
                </div>
                <Input
                  className='pl-12 border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                  placeholder='🔍 Rechercher un étudiant'
                />
              </div>
            </div>
            <div className='rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
              <Table>
                <TableHeader>
                  <TableRow className='border-primary/10 hover:bg-primary/5'>
                    <TableHead className='text-foreground'>ID</TableHead>
                    <TableHead className='text-foreground'>Nom</TableHead>
                    <TableHead className='text-foreground'>Classe</TableHead>
                    <TableHead className='text-foreground'>Moyenne</TableHead>
                    <TableHead className='text-right text-foreground'>Etat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className='border-primary/10 hover:bg-primary/5'>
                      <TableCell className='font-mono text-xs text-muted-foreground sm:text-sm'>{student.id}</TableCell>
                      <TableCell className='font-medium text-foreground'>{student.nom}</TableCell>
                      <TableCell className='text-muted-foreground'>{student.classe}</TableCell>
                      <TableCell className='text-muted-foreground'>{student.moyenne}</TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            student.etat === 'Actif' 
                              ? 'bg-emerald-500/20 text-emerald-700' 
                              : 'bg-amber-500/20 text-amber-700'
                          }`}
                        >
                          {student.etat}
                        </span>
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
