import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EleveSearchById } from './eleve-search-by-id'
import { Input } from '@/components/ui/input'

interface ElevePickerProps {
  className?: string
  Click?: (student: any) => void
  currentStudent: string
}

export function ElevePicker({ className = "", Click, currentStudent = "Selectionner un élève" }: ElevePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [eleve, setEleve] = useState({
    idEleve: "",
    nom: "",
    matricule: ""
  })

  const handleStudentClick = (student: any) => {
    if (Click) {
      Click(student)
    }
    
    setEleve({
      idEleve: student.id_eleve.toString(),
      nom: student.nom_eleve,
      matricule: student.matricule
    })
    
    // Fermer le popover après sélection
    setIsOpen(false)
  }

  const showStudentGiven = (student: any) => {
    if (student) {
      setEleve({
        idEleve: student.id_eleve.toString(),
        nom: student.nom_eleve,
        matricule: student.matricule
      })
    }
  }

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Input
            value={eleve.idEleve ? `${eleve.nom} (N°: ${eleve.matricule})` : "Sélectionner un élève"}
            placeholder={currentStudent}
            className="w-full justify-start cursor-pointer"
            readOnly
          />
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <EleveSearchById
            onStudentFound={showStudentGiven}
            className="border-0 shadow-none"
            onStudentClick={handleStudentClick}
            studentGive={currentStudent}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
