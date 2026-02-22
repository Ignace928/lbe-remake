import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { CreateTextFileComponent } from '@/components/createTextFile'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpenCheck, GraduationCap, HouseIcon, Layers, Search, Sparkles, Users } from 'lucide-react'

export default function ClassePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [helloMessage, setHelloMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')

  const classes = [
    { code: '6A', nom: 'Sixieme A', niveau: '6e', effectif: 34, principal: 'Mme Ba' },
    { code: '5B', nom: 'Cinquieme B', niveau: '5e', effectif: 29, principal: 'M. Faye' },
    { code: '4A', nom: 'Quatrieme A', niveau: '4e', effectif: 31, principal: 'Mme Sow' },
    { code: '3C', nom: 'Troisieme C', niveau: '3e', effectif: 28, principal: 'M. Ndiaye' },
  ]

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesLevel = level === 'all' || item.niveau === level
      const q = search.trim().toLowerCase()
      const matchesSearch =
        q.length === 0 ||
        item.nom.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.principal.toLowerCase().includes(q)
      return matchesLevel && matchesSearch
    })
  }, [classes, level, search])

  const goHome = () => {
    if (typeof window !== 'undefined') window.location.href = '/home'
  }

  const getHelloWorldFromMain = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const result = await window.ipc.hello.getMessage()
      setHelloMessage(result)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Classe - Nextron (with-tailwindcss)</title>
      </Head>
      <div className='fixed top-0 z-20 w-full p-2'>
        <HeaderComponent title='Classes'>
          <Button className='m-1 h-10 w-10 rounded-full' onClick={goHome}>
            <HouseIcon />
          </Button>
        </HeaderComponent>
      </div>
      <div className='app-page relative overflow-hidden'>
        <div className='pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl' />

        <section className='app-page-content'>
          <Card className='border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-6'>
            <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
              <div className='space-y-2'>
                <p className='inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-100'>
                  <Sparkles className='h-4 w-4' />
                  Espace Classes
                </p>
                <h1 className='text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl'>
                  Gestion des classes moderne et claire
                </h1>
                <p className='max-w-2xl text-sm text-slate-200 sm:text-base'>
                  Accede rapidement aux informations essentielles, lance des actions et verifie l etat de
                  communication avec le process principal.
                </p>
              </div>

              <div className='flex flex-wrap gap-2 sm:gap-3'>
                <Button
                  onClick={getHelloWorldFromMain}
                  disabled={isLoading}
                  className='min-w-32 bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                >
                  {isLoading ? 'Chargement...' : 'Tester IPC'}
                </Button>
                <Button
                  variant='outline'
                  onClick={goHome}
                  className='border-slate-200/50 bg-transparent text-slate-100 hover:bg-white/10'
                >
                  Retour accueil
                </Button>
              </div>
            </div>
          </Card>

          <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5'>
            <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
              <div className='relative lg:col-span-2'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Rechercher une classe ou un responsable'
                  className='border-white/20 bg-slate-900/50 pl-9 text-slate-100 placeholder:text-slate-400'
                />
              </div>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className='border-white/20 bg-slate-900/50 text-slate-100'>
                  <SelectValue placeholder='Filtrer par niveau' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tous les niveaux</SelectItem>
                  <SelectItem value='6e'>6e</SelectItem>
                  <SelectItem value='5e'>5e</SelectItem>
                  <SelectItem value='4e'>4e</SelectItem>
                  <SelectItem value='3e'>3e</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='mt-4 rounded-xl border border-white/10 bg-slate-950/35 p-2 sm:p-3'>
              <Table>
                <TableHeader>
                  <TableRow className='border-white/10 hover:bg-white/5'>
                    <TableHead className='text-slate-300'>Code</TableHead>
                    <TableHead className='text-slate-300'>Classe</TableHead>
                    <TableHead className='text-slate-300'>Niveau</TableHead>
                    <TableHead className='text-slate-300'>Effectif</TableHead>
                    <TableHead className='text-right text-slate-300'>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((item) => (
                    <TableRow key={item.code} className='border-white/10 hover:bg-white/5'>
                      <TableCell className='font-mono text-slate-200'>{item.code}</TableCell>
                      <TableCell className='font-semibold text-white'>{item.nom}</TableCell>
                      <TableCell className='text-slate-200'>{item.niveau}</TableCell>
                      <TableCell className='text-slate-200'>{item.effectif}</TableCell>
                      <TableCell className='text-right text-slate-200'>{item.principal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Classes actives</p>
              <div className='mt-3 flex items-end justify-between'>
                <p className='text-3xl font-extrabold text-white'>12</p>
                <Layers className='h-6 w-6 text-cyan-200' />
              </div>
            </Card>
            <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Etudiants</p>
              <div className='mt-3 flex items-end justify-between'>
                <p className='text-3xl font-extrabold text-white'>328</p>
                <Users className='h-6 w-6 text-emerald-200' />
              </div>
            </Card>
            <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Matieres</p>
              <div className='mt-3 flex items-end justify-between'>
                <p className='text-3xl font-extrabold text-white'>26</p>
                <BookOpenCheck className='h-6 w-6 text-indigo-200' />
              </div>
            </Card>
            <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-wide text-slate-300'>Enseignants</p>
              <div className='mt-3 flex items-end justify-between'>
                <p className='text-3xl font-extrabold text-white'>41</p>
                <GraduationCap className='h-6 w-6 text-amber-200' />
              </div>
            </Card>
          </div>

          <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
            <Card className='xl:col-span-2 border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold text-white'>Etat de la communication IPC</p>
                  <p className='text-xs text-slate-300'>Resultat du message "hello" depuis le process main</p>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    errorMessage
                      ? 'bg-red-500/20 text-red-200'
                      : helloMessage
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-slate-500/20 text-slate-200'
                  }`}
                >
                  {errorMessage ? 'Erreur' : helloMessage ? 'Connecte' : 'En attente'}
                </div>
              </div>

              <div className='mt-4 rounded-xl border border-white/15 bg-slate-950/40 p-3 sm:p-4'>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-300'>Message</p>
                <p className='mt-2 break-words text-sm text-slate-100 sm:text-base'>
                  {helloMessage || 'Aucun message recu pour le moment.'}
                </p>
              </div>

              {errorMessage && <p className='mt-3 text-sm font-medium text-red-300'>Erreur: {errorMessage}</p>}
            </Card>

            <Card className='border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5'>
              <p className='text-sm font-semibold text-white'>Actions rapides</p>
              <p className='mt-1 text-xs text-slate-300'>Outils utilitaires pour tests locaux</p>
              <div className='mt-4'>
                <CreateTextFileComponent />
              </div>
            </Card>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}
