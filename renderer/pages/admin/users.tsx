import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { HeaderComponent } from '@/components/layout/header'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import LoadingPage from '@/components/loadingPage'
import { useUserVm } from '@/features/users/user_VModel'
import { User, CreateUser, UpdateUser } from '@/features/users/user_types'
import { UserForm } from '@/features/users/view/user_form'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { Plus, ArrowLeft, Edit, User as UserIcon, Check, Users, Shield } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function UsersPage() {
  const router = useRouter()
  const { data: users, isLoading, error, createUser, updateUser, deleteUser } = useUserVm()

  const [search, setSearch] = React.useState('')

  const handleCreateUser = async (data: CreateUser) => {
    try {
      await createUser.mutateAsync(data)
    } catch (err) {
      console.error('Error creating user:', err)
    }
  }

  const handleUpdateUser = async (user: User, data: UpdateUser) => {
    try {
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
      await deleteUser.mutateAsync(user.id_user)
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  
  const filteredUsers = users.filter(user => 
    user.nom_user?.toLowerCase().includes(search.toLowerCase())
  )

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
        <title>Gestion des utilisateurs - LBE-schoolar</title>
      </Head>
      
      <div className='fixed top-0 z-20 w-full p-2 backdrop-blur-sm'>
        <HeaderComponent title="Gestion des utilisateurs">
          <Button onClick={() => router.push('/admin')} className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-full'})}`}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </HeaderComponent>
      </div>

      <main className='app-page fixed w-full'>
        <ScrollArea className='h-screen border border-lime-500/50 rounded-2xl p-2 p-b-2 w-full'>
          <Card className='border-white/15 bg-white/10 h-full p-4 backdrop-blur-sm sm:p-5'>
            {/* Header avec statut des utilisateurs */}
            <div className='mb-6'>
              <div className='flex items-center gap-3'>
                <Users className='h-5 w-5 text-emerald-400' />
                <div>
                  <p className='text-sm font-semibold text-white'>Utilisateurs du système</p>
                  <p className='mt-1 text-xs text-slate-300'>
                    {users?.length || 0} utilisateur{(users?.length || 0) > 1 ? 's' : ''} enregistré{(users?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {/* Indicateur de statut */}
              <div className='mt-4 flex items-center gap-2'>
                <div className={`h-2 w-2 rounded-full ${users?.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className='text-xs text-slate-300'>
                  {users?.length > 0 ? 'Système actif' : 'Aucun utilisateur configuré'}
                </span>
                {users?.length > 0 && (
                  <span className='text-xs text-emerald-300 ml-auto'>
                    {users.filter(u => u.role === 'admin').length} administrateur{(users.filter(u => u.role === 'admin').length) > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Section de gestion */}
            <div className='border-t border-white/10 pt-4'>
              <p className='text-sm font-semibold text-white mb-4'>Gestion des utilisateurs</p>
              <p className='mt-1 text-xs text-slate-300 mb-4'>Ajouter, modifier et gérer les comptes utilisateurs du système</p>
              
              <div className='flex flex-row items-center gap-2 mb-4'>
                <UserIcon className='text-amber-50'/>
                <Input 
                  className='w-1/2 border-white/20 bg-slate-900/50 text-slate-100 placeholder:text-slate-400'
                  placeholder='Chercher un utilisateur'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <UserForm
                  size = 'default'
                  variant = "ghost"
                  style = "bg-lime-600 hover:bg-lime-700 "
                  trigger=' + Ajouter'
                  onSubmit={handleCreateUser}
                  isLoading={createUser.isPending}
                  title="Ajouter un utilisateur"
                  description="Créez un nouveau compte utilisateur."
                  submitButtonText="Créer"
                />
              </div>
              
              {filteredUsers.length === 0 ? (
                <p className='text-sm text-slate-300 mt-4'>
                  {search ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur disponible 😥'}
                </p>
              ) : (
                <div className='mt-2 overflow-hidden rounded-md border border-white/10 bg-slate-950/35'>
                  <ScrollArea className='h-70 p-2 w-full'>
                    <Table className='rounded-2xl'>
                      <TableHeader>
                        <TableRow className='border-white/10 bg-[#252324] hover:bg-[#2523248f]'>
                          <TableHead className='text-slate-300'>Utilisateur</TableHead>
                          <TableHead className='text-slate-300'>Rôle</TableHead>
                          <TableHead className='text-slate-300'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id_user} className='rounded-md border text-slate-300 hover:bg-[#2523248f] border-white/10 bg-slate-900/50 px-2 py-1'>
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                
                                  <Avatar>
                                    <AvatarFallback className='text-[#050203]'>
                                      {user.nom_user?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                <div>
                                  <div className='font-medium text-slate-100'>{user.nom_user}</div>
                                  <div className='text-sm text-slate-400'>ID: {user.id_user}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Shield className={`h-3 w-3 ${user.role === 'admin' ? 'text-red-400' : 'text-blue-400'}`} />
                                <div className={`rounded-full px-3 py-1 text-xs font-medium w-fit ${
                                  user.role === 'admin' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {user.role}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className='flex items-center gap-2'>
                              <UserForm
                                size = "sm"
                                variant = "ghost"
                                style = "bg-amber-500 text-black hover:bg-amber-300 h-8 text-xs rounded-l-full rounded-r-full cursor-pointer"
                                trigger='Modifier'
                                onSubmit={(data) => handleUpdateUser(user, data)}
                                user={user}
                                isLoading={updateUser.isPending}
                                title="Modifier l'utilisateur"
                                description={`Modifiez les informations de l'utilisateur ${user.nom_user}.`}
                                submitButtonText="Modifier"
                              />
                              <ModalHandleDelete
                                personalization='w-10 h-10 rounded-l-full rounded-r-full cursor-pointer'
                                btnVariant='destructive'
                                state={user.nom_user === 'Necro'}
                                title={`Suppression definitive de ${user.nom_user}`}
                                description='Cette action est irreversible! Voulez-vous continuer?'
                                onConfirm={() => handleDeleteUser(user)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </div>
          </Card>
        </ScrollArea>
      </main>
    </React.Fragment>
  )
}
