import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PenBoxIcon } from 'lucide-react'
import { Eleve } from '../eleve_types'
import { Badge } from '@/components/ui/badge'
import ModalHandleDelete from '@/components/ModalHandleDelete'

interface EleveTableContentProps {
  students: Eleve[]
  onEditStudent: (student: Eleve) => void
  onDeleteStudent: (id: number) => void
  isUpdatePending: boolean
}

export function EleveTableContent({ 
  students, 
  onEditStudent, 
  onDeleteStudent, 
  isUpdatePending 
}: EleveTableContentProps) {

  const Matricule = (eleve:Eleve) => {
      const id = eleve.id_eleve
      const sexe = eleve.sexe
      const currentYear = new Date(eleve.created_at).getFullYear()
      const yearCode = currentYear - 2000 // 24 pour 2024
      
      if (id && sexe) {
        const sexeCode = sexe === 'F' ? 'F' : 'M'
        const matricule = `${id}${sexeCode}/${yearCode}`
        return matricule
      }
    }
  const getStatusBadge = (etat: string) => {
      return etat === 'Actif' ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Actif
        </Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Inactif
        </Badge>
      )
    }
  
    const getSexeBadge = (sexe: string) => {
      return sexe === 'M' ? (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          M
        </Badge>
      ) : (
        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
          F
        </Badge>
      )
    }
  return (
    <div className="w-full overflow-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className='border-primary/10 hover:bg-primary/5'>
            <TableHead className='text-foreground'>Matricule</TableHead>
            <TableHead className='text-foreground'>Nom complet</TableHead>
            <TableHead className='text-foreground'>Sexe</TableHead>
            <TableHead className='text-foreground'>Date de naissance</TableHead>
            <TableHead className='text-foreground'>Téléphone</TableHead>
            <TableHead className='text-foreground'>État</TableHead>
            <TableHead className='text-foreground'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id_eleve} className="border-primary/10 hover:bg-primary/5 transition-colors">
              <TableCell className="">
                <span className="font-mono text-sm">
                  {Matricule(student)}
                </span>
              </TableCell>
              <TableCell className="">
                <div>
                  <span className="font-medium">{student.nom_eleve}</span>
                  {student.post_nom_eleve && (
                    <span className="text-muted-foreground ml-2">{student.post_nom_eleve}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="">
                {getSexeBadge(student.sexe)}
              </TableCell>
              <TableCell className="">
                <span className="text-sm">{student.date_naissance}</span>
              </TableCell>
              <TableCell className="">
                <span className="text-sm">{student.telephone || '-'}</span>
              </TableCell>
              <TableCell className="">
                {getStatusBadge(student.etat)}
              </TableCell>
              <TableCell className="">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onEditStudent(student)}
                    className='bg-amber-400 text-black hover:border-amber-400 hover:cursor-pointer'
                    disabled={isUpdatePending}
                  >
                    <PenBoxIcon/>
                  </Button>
                  
                  <ModalHandleDelete
                    personalization='bg-red-500 text-black hover:text-red-500 hover:border-red-500 hover:cursor-pointer'
                    btnVariant='outline'
                    title={`Supprimer le Matricule N°${Matricule(student)}`}
                    description={`Voulez-vous supprimer definitivement ${student.nom_eleve} ${student.post_nom_eleve}?`}
                    onConfirm={() => {
                      onDeleteStudent(student.id_eleve)
                    }}
                    state={isUpdatePending}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
