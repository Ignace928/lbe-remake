import React, { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EleveForm } from './eleve_form'
import { EleveTableContent } from './eleve_table_content'
import { Eleve } from '../eleve_types'
import { SchoolCertificate } from './certificat'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useAnneeStore } from '@/store/anneStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftFromLine, Eye, FileDown, FilePenLine, FileScan, PenBoxIcon, Plus, Users } from 'lucide-react'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface EleveTableProps {
  students: Eleve[]
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
  const [showCertificate, setShowCertificate] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Eleve | null>(null)
  const {anne_Active} = useAnneeStore()
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
    <div className="space-y-4">
      <div className='mb-6 sticky top-0 z-3 backdrop-blur-3xl'>
        <div className='flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 transition-all duration-300'>
          <div className='rounded-full p-3 shadow-lg transition-all duration-300 bg-linear-to-r from-primary to-secondary'>
            <Users className='h-6 w-6 text-primary-foreground transition-all duration-300' />
          </div>
          <div className='flex-1'>
            <p className='text-lg font-bold text-foreground'>
              {
                editingStudent ? (`${editingStudent.nom_eleve} ${editingStudent.post_nom_eleve}`) : showAddForm ? "Ajouter un nouvel élève" : "Suivi des élèves" 
              }
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              👉  {
                    editingStudent ? (`${Matricule(editingStudent)}`) : showAddForm ? ('Les champs * sont requis') : 
                      `${students.length} élève${(students.length || 0) > 1 ? 's' : ''} inscrit${(students.length || 0) > 1 ? 's' : ''}`
                    
                  }
            </p>
          </div>
          <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
            {
              editingStudent ? (
                <section className='flex flex-row gap-4'>
                  <Button variant='secondary' className='rounded-full' onClick={() => setEditingStudent(null)}>
                    <ArrowLeftFromLine/> Retour
                  </Button>
                  <Button className='rounded-full cursor-pointer' onClick={() => 
                    setShowCertificate(!showCertificate)
                  }>
                    <FileScan/> {showCertificate ? "Information" : "Certificat"} 
                  </Button>
                </section>
              ) : 
              showAddForm ?  (<Button variant='secondary' className='rounded-full' onClick={() => setShowAddForm(false)}><ArrowLeftFromLine/> Retour</Button>) :
               `${students.filter(s => s.etat === 'Actif').length}/${students.length} actifs`
            }
          </span>
        </div>
      </div>


      {/* Tableau des étudiants */}
      {
        editingStudent ? (
          <Card className="border-none bg-linear-to-br from-card via-card to-muted/30 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {
                  showCertificate ? (
                    <PDFDownloadLink
                      className={buttonVariants({variant:'outline'})} 
                      document={
                        <SchoolCertificate data={{
                            birthDate: format(new Date((editingStudent.date_naissance)), "dd MMMM yyyy", { locale: fr }),
                            classLevel: "classe",
                            year: anne_Active.labelle,
                            studentName: `${editingStudent.nom_eleve} ${editingStudent.post_nom_eleve}`,
                          }} 
                        />
                      } 
                      fileName="certificat.pdf"
                    >
                      {({ loading }) => (loading ? "Génération..." : (<span className='flex flex-row gap-4'><FileDown/> Imprimer Certificat</span>))}
                    </PDFDownloadLink>
                  ) : (
                    "Modifier l'information personnelle"
                  )
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Formulaire de modification */}

                {
                  showCertificate ? (
                    <SchoolCertificate data={{
                      birthDate: format(new Date((editingStudent.date_naissance)), "dd MMMM yyyy", { locale: fr }),
                      classLevel: "classe",
                      year: anne_Active.labelle,
                      studentName: ` ${editingStudent.nom_eleve} ${editingStudent.post_nom_eleve} `,
                    }}
                    />
                  ):(
                    <ScrollArea className="rounded-md p-4">
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
                      />
                    </ScrollArea>
                    
                  )
                }
            </CardContent>
          </Card>
          
        ) : showAddForm ? (
          <Card className="border-none bg-linear-to-br from-card via-card to-muted/30 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Information personnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="rounded-md p-4">
                {/* Formulaire de modification */}
                <EleveForm
                  size="default"
                  variant="default"
                  style=""
                  trigger={null}
                  onSubmit={handleCreateStudent}
                  isLoading={createEleveMutation?.isPending || false}
                  title="Ajouter un étudiant"
                  description="Créez un nouvel étudiant dans le système."
                  submitButtonText="Créer"
                  isFirstStudent={students.length === 0}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none bg-linear-to-br from-card via-card to-muted/30 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Liste des élèves</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {students.length} élève{students.length > 1 ? 's' : ''}
                  </span>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="gap-2 bg-primary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un élève
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 rounded-md border">
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucun élève trouvé
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par ajouter votre premier élève
                    </p>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="gap-2 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter le premier élève
                    </Button>
                  </div>
                ) : (
                  <EleveTableContent
                    students={students}
                    onEditStudent={setEditingStudent}
                    onDeleteStudent={onDeleteStudent}
                    isUpdatePending={isUpdatePending}
                  />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
        )
      }
    </div>
  )
}
