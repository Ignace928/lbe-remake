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
import { Plus, ArrowLeft, Edit, User as UserIcon, Check, Users, Shield, GraduationCap, FileText } from 'lucide-react'
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
      // Protection de l'utilisateur Necro - son rôle reste toujours "admin"
      if (user.nom_user === 'Necro') {
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
      if (user.nom_user === 'Necro') {
        console.warn('Tentative de suppression de l\'utilisateur Necro bloquée')
        return
      }
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
    <>
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

      <main className='app-page fixed w-full h-screen overflow-hidden pt-15'> {/* Offset pour le header fixe */}
        <ScrollArea className='h-full border-x-2 border-primary/20 rounded-3xl p-3'>
          <Card className='border-none bg-gradient-to-br from-card via-card to-muted/30 p-6 backdrop-blur-md shadow-xl shadow-primary/5 sm:p-7'>
            {/* Header avec statut des utilisateurs */}
            <div className='mb-6'>
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
                <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary'>
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
                    <div className='rounded-full bg-gradient-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
                      <UserIcon className='h-4 w-4 text-primary-foreground' />
                    </div>
                  </div>
                  <Input 
                    className='pl-12 border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
                    placeholder='🔍 Chercher un utilisateur...'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <UserForm
                  size = 'default'
                  variant = "default"
                  style = "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-2 border-primary/70 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 font-bold"
                  trigger='✨ Ajouter'
                  onSubmit={handleCreateUser}
                  isLoading={createUser.isPending}
                  title="Ajouter un utilisateur"
                  description="Créez un nouveau compte utilisateur."
                  submitButtonText="Créer"
                />
              </div>
            </div>
              
              {filteredUsers.length === 0 ? (
                <div className='rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/20 to-card p-8 text-center'>
                  <div className='text-6xl mb-4'>🔍</div>
                  <p className='text-lg font-medium text-muted-foreground'>
                    {search ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur disponible 😥'}
                  </p>
                </div>
              ) : (
                <div className='rounded-xl border-2 border-primary/20 bg-gradient-to-br from-muted/20 to-card p-4'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-primary/10 hover:bg-primary/5'>
                        <TableHead className='text-foreground'>👤 Utilisateur</TableHead>
                        <TableHead className='text-foreground'>🛡️ Rôle</TableHead>
                        <TableHead className='text-foreground'>⚡ Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id_user} className='border-primary/10 hover:bg-primary/5'>
                          <TableCell>
                            <div className='flex items-center gap-4'>
                              <div className='relative'>
                                <Avatar className='h-12 w-12 border-2 border-primary/20'>
                                  <AvatarFallback className='bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold'>
                                    {user.nom_user?.charAt(0)?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                                  user.role === 'admin' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                  user.role === 'professeur' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                  'bg-gradient-to-r from-gray-400 to-gray-600'
                                }`} />
                              </div>
                              <div>
                                <div className='font-bold text-foreground text-lg flex items-center gap-2'>
                                  {user.nom_user}
                                  {user.nom_user === 'Necro' && (
                                    <span className='text-xs font-bold text-primary px-2 py-1 rounded-full bg-primary/10'>
                                      🔒 Protégé
                                    </span>
                                  )}
                                </div>
                                <div className='text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-lg inline-block'>ID: {user.id_user}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              <div className={`p-2 rounded-full ${
                                user.role === 'admin' ? 'bg-gradient-to-r from-red-100 to-red-200 shadow-lg shadow-red-500/20' :
                                user.role === 'professeur' ? 'bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg shadow-blue-500/20' :
                                user.role === 'secretaire' ? 'bg-gradient-to-r from-green-100 to-green-200 shadow-lg shadow-green-500/20' :
                                'bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg shadow-gray-500/20'
                              }`}>
                                {
                                  user.role==='admin' ? (<Shield className="h-5 w-5 text-red-600" />) : 
                                  user.role==='professeur' ? (<GraduationCap className="h-5 w-5 text-blue-600" />) : 
                                  user.role==='secretaire' ? (<FileText className="h-5 w-5 text-green-600" />) :
                                  (<UserIcon className="h-5 w-5 text-gray-600" />)
                                }
                              </div>
                              <div className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${
                                user.role === 'admin' 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700 shadow-lg shadow-red-500/30' 
                                  : user.role === 'professeur'
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/30'
                                  : user.role === 'secretaire'
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 shadow-lg shadow-green-500/30'
                                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-700 shadow-lg shadow-gray-500/30'
                              }`}>
                                {user.role}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='flex items-center gap-2'>
                            <UserForm
                              size = "sm"
                              variant = "ghost"
                              style = "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 border-2 border-amber-600 shadow-lg shadow-amber-500/30 h-10 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105"
                              trigger='✏️ Modifier'
                              onSubmit={(data) => handleUpdateUser(user, data)}
                              user={user}
                              isLoading={updateUser.isPending}
                              title="Modifier l'utilisateur"
                              description={`Modifiez les informations de l'utilisateur ${user.nom_user}.`}
                              submitButtonText="Modifier"
                              disabled={user.id_user === 1}
                            />
                            <ModalHandleDelete
                              personalization='h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-700 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105'
                              btnVariant='destructive'
                              state={user.id_user === 1}
                              title={`Suppression definitive de ${user.nom_user}`}
                              description={user.id_user === 1 ? 'Cet utilisateur est protégé et ne peut pas être supprimé!' : 'Cette action est irreversible! Voulez-vous continuer?'}
                              onConfirm={() => handleDeleteUser(user)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
        </ScrollArea>
      </main>
    </>
  )
}
