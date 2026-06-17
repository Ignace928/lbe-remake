import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserForm } from './user_form'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { User, CreateUser, UpdateUser } from '../user_types'
import { Edit, User as UserIcon, Shield, GraduationCap, FileText } from 'lucide-react'

interface UserTableProps {
  users: User[]
  search: string
  onUpdateUser: (user: User, data: UpdateUser) => Promise<void>
  onDeleteUser: (user: User) => Promise<void>
  isUpdatePending: boolean
}

export function UserTable({ 
  users, 
  search, 
  onUpdateUser, 
  onDeleteUser, 
  isUpdatePending 
}: UserTableProps) {
  
  const filteredUsers = users.filter(user => 
    user.nom_user?.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdateUser = async (user: User, data: UpdateUser) => {
    await onUpdateUser(user, data)
  }

  const handleDeleteUser = async (user: User) => {
    await onDeleteUser(user)
  }

  if (filteredUsers.length === 0) {
    return (
      <div className='rounded-xl border-2 border-primary/20 bg-linear-to-br from-muted/20 to-card p-8 text-center'>
        <div className='text-6xl mb-4'>🔍</div>
        <p className='text-lg font-medium text-muted-foreground'>
          {search ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur disponible 😥'}
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-xl border-2 border-primary/20 bg-linear-to-br from-muted/20 to-card p-4'>
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
                      <AvatarFallback className='bg-linear-to-br from-primary/20 to-secondary/20 text-primary font-bold'>
                        {user.nom_user?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                      user.role === 'admin' ? 'bg-linear-to-r from-red-400 to-red-600' :
                      user.role === 'professeur' ? 'bg-linear-to-r from-blue-400 to-blue-600' :
                      'bg-linear-to-r from-gray-400 to-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className='font-bold text-foreground text-lg flex items-center gap-2'>
                      {user.nom_user}
                      {user.id_user === 1 && (
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
                    user.role === 'admin' ? 'bg-linear-to-r from-red-100 to-red-200 shadow-lg shadow-red-500/20' :
                    user.role === 'professeur' ? 'bg-linear-to-r from-blue-100 to-blue-200 shadow-lg shadow-blue-500/20' :
                    user.role === 'secretaire' ? 'bg-linear-to-r from-green-100 to-green-200 shadow-lg shadow-green-500/20' :
                    'bg-linear-to-r from-gray-100 to-gray-200 shadow-lg shadow-gray-500/20'
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
                      ? 'bg-linear-to-r from-red-500 to-red-600 text-white border-red-700 shadow-lg shadow-red-500/30' 
                      : user.role === 'professeur'
                      ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/30'
                      : user.role === 'secretaire'
                      ? 'bg-linear-to-r from-green-500 to-green-600 text-white border-green-700 shadow-lg shadow-green-500/30'
                      : 'bg-linear-to-r from-gray-500 to-gray-600 text-white border-gray-700 shadow-lg shadow-gray-500/30'
                  }`}>
                    {user.role}
                  </div>
                </div>
              </TableCell>
              <TableCell className='flex items-center gap-2'>
                <UserForm
                  size="sm"
                  variant="ghost"
                  style="bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 border-2 border-amber-600 shadow-lg shadow-amber-500/30 h-10 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105"
                  trigger='✏️ Modifier'
                  onSubmit={(data) => handleUpdateUser(user, data)}
                  user={user}
                  isLoading={isUpdatePending}
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
  )
}
