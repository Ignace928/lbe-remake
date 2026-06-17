import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { HeaderComponent } from '@/components/layout/header'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

import LoadingPage from '@/components/loadingPage'
import { useUserVm } from '@/features/users/user_VModel'
import { User, CreateUser, UpdateUser } from '@/features/users/user_types'
import { UserForm } from '@/features/users/view/user_form'
import { UserTable } from '@/features/users/view/user_table'
import { Plus, ArrowLeft, Users, UserIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function UsersPage() {
  const router = useRouter()
  const { data: users, isLoading, error, createUser, updateUser, deleteUser } = useUserVm()
  const {user} = useAuthStore()

  const [search, setSearch] = React.useState('')
  const [show, setShow] = React.useState(false)

  const handleCreateUser = async (data: CreateUser) => {
    try {
      await createUser.mutateAsync(data)
    } catch (err) {
      console.error('Error creating user:', err)
    }
  }

  const handleUpdateUser = async (user: User, data: UpdateUser) => {
    try {
      // Protection de l'utilisateur Necro - son rôle reste toujours "admin"
      if (user.id_user === 1) {
        data.role = 'admin' // Forcer le rôle à admin
      }
      await updateUser.mutateAsync({ 
        id: user.id_user, 
        input: data 
      })
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  const handleDeleteUser = async (user: User) => {
    try {
      // Protection de l'utilisateur Necro - il ne peut pas être supprimé
      if (user.id_user === 1) {
        console.warn('Tentative de suppression de l\'utilisateur Necro bloquée')
        return
      }
      await deleteUser.mutateAsync(user.id_user)
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }
  useEffect(()=>{
    if(!user) window.location.href = '/'
    else if(user.role!=="admin") window.location.href = "/"
  },[])

  if (isLoading) return <LoadingPage size={40} />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Erreur lors du chargement des utilisateurs</p>
            <Button onClick={() => router.reload()} className="mt-4">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Head>
        <title>LBE Scholar - Utilisateur</title>
      </Head>
      
      <div className='fixed top-0 z-20 w-full p-2 backdrop-blur-sm'>
        <HeaderComponent title="Gestion des utilisateurs">
          <Button onClick={() => router.push('/admin')} className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-full'})}`}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </HeaderComponent>
      </div>

      <main className='app-page fixed w-full h-screen overflow-hidden pt-15'> {/* Offset pour le header fixe */}
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-linear-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            {/* Header avec statut des utilisateurs */}
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-linear-to-r from-primary to-secondary'>
                  <Users className='h-6 w-6 text-primary-foreground transition-all duration-300' />
                </div>
                <div className='flex-1'>
                  <p className='text-lg font-bold text-foreground'>Utilisateurs du système</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    👉 {users?.length || 0} utilisateur{(users?.length || 0) > 1 ? 's' : ''} enregistré{(users?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                  {users.filter(u => u.role === 'admin').length} admin{(users.filter(u => u.role === 'admin').length) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Section de gestion */}
            <div className='mb-6'>
              <div className='grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] items-center'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <div className='rounded-full bg-linear-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
                      <UserIcon className='h-4 w-4 text-primary-foreground' />
                    </div>
                  </div>
                  <Input 
                    className='pl-12 border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                    placeholder='🔍 Necro...'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <UserForm
                  showform={show}
                  hiddeform={()=>setShow(false)}
                  trigger={(
                    <Button onClick={()=>setShow(true)}
                      className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-2 border-primary/70 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 font-bold">
                      ✨ Ajouter
                    </Button>
                  )}
                  onSubmit={handleCreateUser}
                  isLoading={createUser.isPending}
                  title="Ajouter un utilisateur"
                  description="Créez un nouveau compte utilisateur."
                  submitButtonText="Créer"
                />
              </div>
            </div>
              <ScrollArea className='h-[calc(60vh-100px)] border-none p-3'>

                <UserTable
                  users={users}
                  search={search}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  isUpdatePending={updateUser.isPending}
                />
              </ScrollArea>
            </Card>
        </ScrollArea>
      </main>
    </React.Fragment>
  )
}
