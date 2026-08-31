import React, { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { EleveForm } from './eleve_form'
import { DataTable } from './eleve_data_table'
import { columns, EleveTableData } from './eleve_columns'
import { Button } from '@/components/ui/button'
import { ArrowLeftFromLine, Users } from 'lucide-react'
import { TitleComponent } from '@/components/layout/title_component'

interface EleveTableProps {
  students: EleveTableData[]
  onUpdateStudent: (id: number, data: any) => Promise<void>
  onDeleteStudent: (id: number) => Promise<void>
  createEleve: (data: any) => Promise<void>
  createEleveMutation: any
  isUpdatePending?: boolean
}

export function EleveTable({ 
  students, 
  onUpdateStudent, 
  onDeleteStudent, 
  createEleve,
  createEleveMutation,
  isUpdatePending = false 
}: EleveTableProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<EleveTableData | null>(null)

  const handleCreateStudent = async (data: any) => {
    try {
      await createEleve(data)
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

  

  return (
    <ScrollArea className="min-h-0 flex flex-col h-full">
      <TitleComponent Icon={Users}>
          <div className='flex-1'>
            <p className='text-lg font-bold text-foreground'>
              {
                editingStudent ? (`${editingStudent.nom_eleve} ${editingStudent.post_nom_eleve}`) : showAddForm ? "Ajouter un nouvel élève" : "Suivi des élèves" 
              }
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              👉  {
                    editingStudent ? (`${editingStudent.matricule}`) : showAddForm ? ('Les champs * sont requis') : 
                      `sur ${students.length} élève${(students.length || 0) > 1 ? 's' : ''} inscrit${(students.length || 0) > 1 ? 's' : ''}`
                    
                  }
            </p>
          </div>
            {
              editingStudent ? (
                  <Button variant='secondary' className='rounded-full' onClick={() => setEditingStudent(null)}>
                    <ArrowLeftFromLine/> Retour
                  </Button>
              ) : 
              showAddForm ?  (<Button variant='secondary' className='rounded-full' onClick={() => setShowAddForm(false)}><ArrowLeftFromLine/> Retour</Button>) :
               `${students.filter(s => s.etat === 'Actif').length}/${students.length} actifs`
            }
      </TitleComponent>


      {/* Tableau des étudiants */}
      {
        editingStudent ? (
          <div className='flex'>
            <Card className="pt-4 min-h-0 h-full border-none shadow-xl">
              <CardContent>
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
                  submitButtonText="Metre à jour"
                />
              </CardContent>
            </Card>
          </div>
          
        ) : showAddForm ? (
          <div className='flex'>
              <section className='fixed p-4 z-1 w-full bg-card'>
                  Information personnelle
              </section>
            <Card className="pt-4 min-h-0 h-full border-none shadow-xl">
              <CardContent>

                  <EleveForm
                    size="default"
                    variant="default"
                    style=""
                    trigger={null}
                    onSubmit={handleCreateStudent}
                    isLoading={createEleveMutation?.isPending || false}
                    title="Ajouter un étudiant"
                    description="Créez un nouvel étudiant dans le système."
                    submitButtonText="Enregistrer"
                    isFirstStudent={students.length === 0}
                  />
              </CardContent>
            </Card>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={students}
            onEditStudent={(student) => setEditingStudent(student)}
            onDeleteStudent={onDeleteStudent}
            isUpdatePending={isUpdatePending}
            onAddStudent={() => setShowAddForm(true)}
          />
        )}
      
    </ScrollArea>
  )
}
