import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, X, Users } from 'lucide-react'
import { useEleveByIdQuery } from '@/features/eleves/eleve_VModel'
import { toast } from 'sonner'

interface EleveSearchByIdProps {
  className?: string
  onStudentFound?: (student: any) => void
  onStudentClick?:(student:any) => void
  studentGive?:string
}

export function EleveSearchById({ studentGive,className = "", onStudentFound, onStudentClick }: EleveSearchByIdProps) {
  const [searchId, setSearchId] = useState("")
  
  const { data: studentById, isLoading: isLoadingSearch, error: searchError } = useEleveByIdQuery(
    searchId ? parseInt(searchId) : 0
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
      <h3 className='text-lg font-semibold mb-3'>Recherche par ID</h3>
      <div className='flex gap-3 items-end'>
        <div className='flex-1'>
          <label className='text-sm font-medium mb-2 block'>ID de l'étudiant:</label>
          <Input
            placeholder="Entrez l'ID pour rechercher..."
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
            <Card onClick={handleClick}  className="mt-4 p-4 bg-green-50 border-green-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">
                      {studentById.nom_eleve} {studentById.post_nom_eleve || ''}
                    </div>
                    <div className="text-sm text-green-700">
                      ID: {studentById.id_eleve} • Matricule: {studentById.matricule}
                    </div>
                    <div className="text-sm text-green-600">
                      {studentById.lieu_naissance || 'Lieu non spécifié'} • {studentById.sexe}
                    </div>
                  </div>
                  <Badge variant={studentById.sexe === 'M' ? 'default' : 'secondary'}>
                    {studentById.sexe}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
      
      {/* Erreur de recherche */}
      {searchError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            Erreur lors de la recherche: {searchError.message}
          </p>
        </div>
      )}
    </div>
  )
}
