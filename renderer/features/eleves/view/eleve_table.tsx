import React, { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Users } from 'lucide-react'
import { Eleve } from '../eleve_types'
import { EleveForm } from './eleve_form'

interface EleveTableProps {
  students: Eleve[]
  onUpdateStudent: (id: number, data: any) => void
  onDeleteStudent: (id: number) => void
  createEleve: any
  isUpdatePending?: boolean
}

export function EleveTable({ 
  students, 
  onUpdateStudent, 
  onDeleteStudent, 
  createEleve,
  isUpdatePending = false 
}: EleveTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Eleve | null>(null)

  const handleCreateStudent = async (data: any) => {
    try {
      await createEleve.mutateAsync(data)
      setShowAddForm(false)
    } catch (err) {
      console.error('Error creating student:', err)
    }
  }

  const handleUpdateStudent = async (data: any) => {
    if (!editingStudent) return
    
    try {
      await onUpdateStudent(editingStudent.id_eleve, data)
      setEditingStudent(null)
    } catch (err) {
      console.error('Error updating student:', err)
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
    <div className="space-y-4">
      {/* Formulaire d'ajout */}
      <EleveForm
        size="default"
        variant="default"
        style=""
        trigger={null}
        onSubmit={handleCreateStudent}
        isLoading={createEleve.isPending}
        title="Ajouter un étudiant"
        description="Créez un nouvel étudiant dans le système."
        submitButtonText="Créer"
        open={showAddForm}
        onOpenChange={setShowAddForm}
        isFirstStudent={students.length === 0}
      />

      {/* Formulaire de modification */}
      {editingStudent && (
        <EleveForm
          size="default"
          variant="default"
          style=""
          trigger={null}
          onSubmit={handleUpdateStudent}
          eleve={editingStudent}
          isLoading={isUpdatePending}
          title="Modifier un étudiant"
          description="Modifiez les informations de l'étudiant."
          submitButtonText="Mettre à jour"
          open={!!editingStudent}
          onOpenChange={(open) => !open && setEditingStudent(null)}
        />
      )}

      {/* Tableau des étudiants */}
      <Card className="border-none bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des étudiants</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {students.length} étudiant{students.length > 1 ? 's' : ''}
              </span>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Plus className="h-4 w-4" />
                Ajouter un étudiant
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] rounded-md border">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucun étudiant trouvé
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter votre premier étudiant
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter le premier étudiant
                </Button>
              </div>
            ) : (
              <div className="w-full overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-sm">Matricule</th>
                      <th className="text-left p-3 font-medium text-sm">Nom complet</th>
                      <th className="text-left p-3 font-medium text-sm">Sexe</th>
                      <th className="text-left p-3 font-medium text-sm">Date de naissance</th>
                      <th className="text-left p-3 font-medium text-sm">Téléphone</th>
                      <th className="text-left p-3 font-medium text-sm">État</th>
                      <th className="text-left p-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id_eleve} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <span className="font-mono text-sm">{student.matricule}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <span className="font-medium">{student.nom_eleve}</span>
                            {student.post_nom_eleve && (
                              <span className="text-muted-foreground ml-2">{student.post_nom_eleve}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {getSexeBadge(student.sexe)}
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{student.date_naissance}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{student.telephone || '-'}</span>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(student.etat)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingStudent(student)}
                              disabled={isUpdatePending}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDeleteStudent(student.id_eleve)}
                              disabled={isUpdatePending}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
