import React from 'react'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { User } from '../user_types'

// interface DeleteConfirmDialogProps {
//   onConfirm: () => void
//   user: User | null
//   isLoading?: boolean
// }

// export function DeleteConfirmDialog({ onConfirm, user, isLoading = false }: DeleteConfirmDialogProps) {
//   // ModalHandleDelete gère son propre état, donc on utilise un trigger externe
//   return (
//     <div className="hidden">
//       <ModalHandleDelete
//         personalization=""
//         btnVariant="outline"
//         state={isLoading}
//         title="Supprimer l'utilisateur"
//         description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user?.nom_user}" ? Cette action est irréversible.`}
//         onConfirm={onConfirm}
//       />
//     </div>
//   )
// }

// Composant trigger pour le bouton de suppression
export function DeleteUserButton({ user, onDelete, isLoading }: { user: User; onDelete: () => void; isLoading?: boolean }) {
  return (
    <ModalHandleDelete
      personalization="h-8 w-8 p-0"
      btnVariant="outline"
      state={isLoading || user.nom_user === 'Necro'}
      title="Supprimer l'utilisateur"
      description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom_user}" ? Cette action est irréversible.`}
      onConfirm={onDelete}
    />
  )
}
