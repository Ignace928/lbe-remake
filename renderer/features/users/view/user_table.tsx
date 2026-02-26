import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Edit, 
  User as UserIcon,
  Shield,
  GraduationCap,
  FileText
} from 'lucide-react'
import { User } from '../user_types'
import { DeleteUserButton } from './delete_confirm_dialog'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'professeur': return <GraduationCap className="h-4 w-4" />
      case 'secretaire': return <FileText className="h-4 w-4" />
      default: return <UserIcon className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'professeur': return 'default'
      case 'secretaire': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#1A1A1D]">Utilisateur</TableHead>
          <TableHead className="text-[#1A1A1D]">Rôle</TableHead>
          <TableHead className="text-[#1A1A1D] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id_user} className="hover:bg-slate-50">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100">
                  <UserIcon className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <div className="font-medium text-[#1A1A1D]">{user.nom_user}</div>
                  <div className="text-sm text-[#252324]">ID: {user.id_user}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-2 w-fit">
                {getRoleIcon(user.role)}
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DeleteUserButton 
                  user={user}
                  onDelete={() => onDelete(user)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
