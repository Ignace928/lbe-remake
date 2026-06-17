import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, X, GraduationCap } from 'lucide-react'
import { useClasseQuery } from '@/features/classes/classe_VModel'
import { toast } from 'sonner'
import { ScrollArea } from '../ui/scroll-area'

interface ClasseSearchByNameProps {
  className?: string
  onClasseFound?: (classe: any) => void
  onClasseClick?: (classe: any) => void
  classeGive?: string
}

export function ClasseSearchByName({ classeGive, className = "", onClasseFound, onClasseClick }: ClasseSearchByNameProps) {
  const [searchName, setSearchName] = useState("")
  
  const { data: classes, isLoading: isLoadingSearch, error: searchError } = useClasseQuery()

  // Filtrer les classes par nom
  const filteredClasses = React.useMemo(() => {
    if (!searchName.trim() || !classes) return []
    
    const searchTerm = searchName.toLowerCase()
    return classes.filter((classe: any) => 
      classe.nom_classe?.toLowerCase().includes(searchTerm) ||
      classe.niveau?.toLowerCase().includes(searchTerm) ||
      classe.titulaire?.toLowerCase().includes(searchTerm)
    )
  }, [searchName, classes])

  const handleSearch = () => {
    if (!searchName.trim()) {
      toast.error("Veuillez entrer un nom de classe pour rechercher")
      return
    }
    // La recherche se fait automatiquement avec le filtre
  }

  const handleClearSearch = () => {
    setSearchName("")
  }

  // Notifier le parent quand une classe est trouvée
  React.useEffect(() => {
    if (filteredClasses.length === 1 && onClasseFound) {
      onClasseFound(filteredClasses[0])
    }
  }, [filteredClasses, onClasseFound])

  const handleClick = (classe: any) => {
    if (onClasseClick) {
      onClasseClick(classe)
    }
  }
  
  React.useEffect(() => {
    if (classeGive) {
      setSearchName(classeGive)
    }
  }, [])

  return (
    <div className={`p-4 bg-muted/30 rounded-lg border ${className}`}>
      <h3 className='text-lg font-semibold mb-3'>Recherche par nom</h3>
      <div className='flex gap-3 items-end'>
        <div className='flex-1'>
          <label className='text-sm font-medium mb-2 block'>Nom de la classe:</label>
          <Input
            placeholder="Entrez le nom pour rechercher..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isLoadingSearch || !searchName.trim()}
          className="h-10 px-4"
        >
          {isLoadingSearch ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        {searchName && (
          <Button 
            variant="outline"
            onClick={handleClearSearch}
            className="h-10 px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Résultats de la recherche */}
      {filteredClasses.length > 0 && (
      <ScrollArea className='mt-4 h-50 flex gap-4 space-y-2'>
        <div className='flex flex-col gap-1'>

          {filteredClasses.map((classe: any) => (
            <Card onClick={() => handleClick(classe)} key={classe.id_classe} className="p-4 bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      {classe.nom_classe}
                    </div>
                    <div className="text-sm text-blue-700">
                      Niveau: {classe.niveau} • ID: {classe.id_classe}
                    </div>
                    <div className="text-sm text-blue-600">
                      Titulaire: {classe.titulaire || 'Non spécifié'}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {classe.niveau}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}

          </div>
          </ScrollArea>
      )}
      
      {/* Message si aucun résultat */}
      {searchName.trim() && filteredClasses.length === 0 && !isLoadingSearch && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Aucune classe trouvée pour "{searchName}"
          </p>
        </div>
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
