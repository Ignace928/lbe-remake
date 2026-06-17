import React, { useEffect, useMemo, useState } from 'react'
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
import { ArrowLeftFromLineIcon, BookOpenCheck, ChevronRight, GraduationCap, Layers, LucideHome, Search, Sparkles, Users } from 'lucide-react'
import { SearchInput } from '@/components/search_input'
import { useRouter } from 'next/router'
import { useAnneeStore } from '@/store/anneStore'
import { useAuthStore } from '@/store/authStore'
import { useDatabaseStatusQuery } from '@/features/database/database_VModel'
import LoadingPage from '@/components/loadingPage'
import { ClasseTable } from '@/features/classes/view/classe_table'
import SidebarMotion from '@/components/layout/Sidebar_Motion'

export default function ClassePage() {
  // const filteredClasses = useMemo(() => {
  //   return classes.filter((item) => {
  //     const matchesLevel = level === 'all' || item.niveau === level
  //     const q = search.trim().toLowerCase()
  //     const matchesSearch =
  //       q.length === 0 ||
  //       item.nom.toLowerCase().includes(q) ||
  //       item.code.toLowerCase().includes(q) ||
  //       item.principal.toLowerCase().includes(q)
  //     return matchesLevel && matchesSearch
  //   })
  // }, [classes, level, search])
  const [me, setMe] = useState('')
  const {user, hasHydrated} = useAuthStore()
  const {data, isLoading, error} = useDatabaseStatusQuery()
  const router = useRouter()
  useEffect(() => {
    if (!hasHydrated) return
    
    if(!user) window.location.href = '/'
    else{
      setMe(user.nom_user)
    }
  }, [user, hasHydrated])

  if(isLoading || !hasHydrated) return (<LoadingPage size={40}/>)

  // Vérifier si la base de données est initialisée
  if(error || !data?.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <Users className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Base de données non initialisée
              </h2>
              <p className="text-gray-600 mb-4">
                {data?.message || 'Veuillez contacter l\'administrateur pour synchroniser la base de données.'}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ Impossible d'accéder aux données des étudiants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <Head>
        <title>Lycée Benjamin Escande - Classes</title>
      </Head>

      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="z-20 shrink-0 p-2">
            <HeaderComponent title='Classes'>
              <Button className='m-1 h-10 w-10 rounded-full' onClick={()=> router.push('/home')}>
                <LucideHome />
              </Button>
            </HeaderComponent>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-x-2 border-primary/20 bg-linear-to-br from-card via-card to-muted/30 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">  
            <ClasseTable />
          </Card>

            <SidebarMotion current='/classe'/>

        </main>
      </div>
    </>
  )
}
