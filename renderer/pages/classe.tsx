import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeaderComponent } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftFromLineIcon, BookOpenCheck, GraduationCap, Layers, Search, Sparkles, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

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
                  <Layers className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Gestion des classes</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {filteredClasses.length} classe{(filteredClasses.length || 0) > 1 ? 's' : ''} trouvée{(filteredClasses.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  {classes.length} totale
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
                <div className='relative lg:col-span-2'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <div className='rounded-full bg-gradient-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
                      <Search className='h-4 w-4 text-primary-foreground' />
                    </div>
                  </div>
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='🔍 Rechercher une classe ou un responsable'
                    className='pl-12 border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                  />
                </div>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className='border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card text-foreground rounded-xl'>
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
            </div>

            <div className='mb-6'>
              <div className='rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-primary/10 hover:bg-primary/5'>
                      <TableHead className='text-foreground'>Code</TableHead>
                      <TableHead className='text-foreground'>Classe</TableHead>
                      <TableHead className='text-foreground'>Niveau</TableHead>
                      <TableHead className='text-foreground'>Effectif</TableHead>
                      <TableHead className='text-right text-foreground'>Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((item) => (
                      <TableRow key={item.code} className='border-primary/10 hover:bg-primary/5'>
                        <TableCell className='font-mono text-foreground'>{item.code}</TableCell>
                        <TableCell className='font-semibold text-foreground'>{item.nom}</TableCell>
                        <TableCell className='text-muted-foreground'>{item.niveau}</TableCell>
                        <TableCell className='text-muted-foreground'>{item.effectif}</TableCell>
                        <TableCell className='text-right text-muted-foreground'>{item.principal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Classes actives</p>
                <div className='mt-3 flex items-end justify-between'>
                  <p className='text-3xl font-extrabold text-foreground'>12</p>
                  <Layers className='h-6 w-6 text-primary' />
                </div>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Etudiants</p>
                <div className='mt-3 flex items-end justify-between'>
                  <p className='text-3xl font-extrabold text-foreground'>328</p>
                  <Users className='h-6 w-6 text-primary' />
                </div>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Matieres</p>
                <div className='mt-3 flex items-end justify-between'>
                  <p className='text-3xl font-extrabold text-foreground'>26</p>
                  <BookOpenCheck className='h-6 w-6 text-primary' />
                </div>
              </Card>
              <Card className='border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                <p className='text-sm text-muted-foreground'>Enseignants</p>
                <div className='mt-3 flex items-end justify-between'>
                  <p className='text-3xl font-extrabold text-foreground'>41</p>
                  <GraduationCap className='h-6 w-6 text-primary' />
                </div>
              </Card>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </React.Fragment>
  )
}
