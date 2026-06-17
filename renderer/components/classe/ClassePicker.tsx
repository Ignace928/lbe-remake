import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ClasseSearchByName } from './classe_search_by_name'
import { Input } from '@/components/ui/input'

interface ClassePickerProps {
  className?: string
  Click?: (classe: any) => void
  currentClasse?: string
}

export function ClassePicker({ className = "", Click, currentClasse = "" }: ClassePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [classe, setClasse] = useState({
    idClasse: "",
    nom: "",
    niveau: ""
  })

  const handleClasseClick = (classeData: any) => {
    if (Click) {
      Click(classeData)
    }
    
    setClasse({
      idClasse: classeData.id_classe.toString(),
      nom: classeData.nom_classe,
      niveau: classeData.niveau
    })
    
    // Fermer le popover après sélection
    setIsOpen(false)
  }

  const showClasseGiven = (classeData: any) => {
    if (classeData) {
      setClasse({
        idClasse: classeData.id_classe.toString(),
        nom: classeData.nom_classe,
        niveau: classeData.niveau
      })
    }
  }

  React.useEffect(() => {
    if (currentClasse) {
      // Si currentClasse est un ID, on pourrait chercher la classe correspondante
      // Pour l'instant, on le considère comme le nom
      setClasse(prev => ({
        ...prev,
        nom: currentClasse
      }))
    }
  }, [currentClasse])

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Input
            value={classe.idClasse ? `${classe.nom} (${classe.niveau})` : "Sélectionner une classe"}
            placeholder="Sélectionner une classe"
            className="w-full justify-start cursor-pointer"
            readOnly
          />
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <ClasseSearchByName 
            className="border-0 shadow-none"
            onClasseClick={handleClasseClick}
            classeGive={currentClasse}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
