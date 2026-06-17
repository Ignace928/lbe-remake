import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InscriptionSearchById } from './inscriptionById'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card'
import { useSelectedInscription, useSelectInscription } from '@/store/inscriptionStore'
import { Inscription } from '@/features/inscriptions/inscription_types'

interface InscriptionPickerProps {
  className?: string
  onInscriptionClick:(inscrit:Inscription)=>void
  placeHolder?:string
  currentStudent?: string
}

export function EleveInscritPicker({ onInscriptionClick, className = "", currentStudent, placeHolder="Selectionne un eleve" }: InscriptionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inscription = useSelectedInscription()
  const handleStudentClick = (inscrit: Inscription) => {
    onInscriptionClick(inscrit)
    // Fermer le popover après sélection
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {/* <Input
            value={eleve.idEleve ? `${eleve.nom} (N°: ${eleve.matricule})` : "Payement pour"}
            placeholder={currentStudent}
            className="w-full justify-start cursor-pointer"
            readOnly
          /> */}
          <Card className=' flex items-center justify-center p-2 mx-1 border-primary/20 cursor-pointer'>
            {inscription?.id_inscription ? `${inscription.eleve.nom_eleve} (N°: ${inscription.eleve.matricule})` : placeHolder}
          </Card>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <InscriptionSearchById
            className="border-0 shadow-none"
            onStudentClick={handleStudentClick}
            studentGive={currentStudent}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
