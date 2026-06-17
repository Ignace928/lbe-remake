import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, X, Users } from 'lucide-react'
import { useEleveByIdQuery } from '@/features/eleves/eleve_VModel'
import { toast } from 'sonner'
import { useInscriptionByIdQuery } from '@/features/inscriptions/inscription_VModel'
import { useAnneeStore } from '@/store/anneStore'

interface InscriptionSearchByIdProps {
  className?: string
  onStudentFound?: (student: any) => void
  onStudentClick?:(student:any) => void
  studentGive?:string
}

export function InscriptionSearchById({ studentGive,className = "", onStudentFound, onStudentClick }: InscriptionSearchByIdProps) {
  const id_anne = useAnneeStore().anne_Active.id_anne
  const [searchId, setSearchId] = useState("")
  const { data: studentById, isLoading: isLoadingSearch, error: searchError } = useInscriptionByIdQuery(
    {id_eleve:searchId ? parseInt(searchId) : 0, id_anne}
  )

  const handleSearchById = () => {
    const id = parseInt(searchId.trim())
    if (isNaN(id) || id <= 0) {
      toast.error("Veuillez entrer les identifiants numérique valide")
      return
    }
    // La recherche se déclenche automatiquement grâce au hook useEleveByIdQuery
  }

  const handleClearSearch = () => {
    setSearchId("")
  }

  // Notifier le parent quand un étudiant est trouvé
  React.useEffect(() => {
    
    if (studentById && onStudentFound) {
      onStudentFound(studentById)
    }
  }, [studentById, onStudentFound])

  const handleClick = () => {
    if(onStudentClick){
      onStudentClick(studentById)
    }
    else console.log(studentById)
  }
  
  React.useEffect(()=>{
    if(studentGive){
      setSearchId(studentGive)
    }
  },[])
  return (
    <div className={`p-4 bg-muted/30 rounded-lg border ${className}`}>
      <h3 className='text-lg font-semibold mb-3'>Rechercher un eleve</h3>
      <div className='flex gap-3 items-end'>
        <div className='flex-1'>
          <label className='text-sm font-medium mb-2 block'>ID de l'eleve :</label>
          <Input
            placeholder="Entrez l'IDENTIFICATION de l'élève..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchById()
              }
            }}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleSearchById}
          disabled={isLoadingSearch || !searchId.trim()}
          className="h-10 px-4"
        >
          {isLoadingSearch ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        {searchId && (
          <Button 
            variant="outline"
            onClick={handleClearSearch}
            className="h-10 px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Résultat de la recherche */}

          {studentById && (
            <Card onClick={handleClick}  className="mt-4 p-4 cursor-pointer border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">
                      {studentById.eleve.nom_eleve} {studentById.eleve.post_nom_eleve || ''} ({studentById.eleve.matricule ||""})
                    </div>
                    <div className="flex  gap-2 items-center text-primary">
                      <p className='text-sm'>•Classe: </p>
                      <p className='font-bold'>{studentById.classe.nom_classe}</p>
                    </div>
                    <div className="flex gap-2 items-center text-primary">
                      <p className='text-sm'>•Inscrit(e):</p> 
                      <p className='font-bold'>{studentById.anneeScolaire.libelle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
      
      {/* Erreur de recherche */}
      {searchError && (
        <Card className="mt-4 p-3">
          <p className="text-md text-center">
            {searchError.message}
          </p>
        </Card>
      )}
    </div>
  )
}
