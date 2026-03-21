import React, { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeftFromLine, Eye, FileDown, FilePenLine, FileScan, PenBoxIcon, Plus, Users } from 'lucide-react'
import { Eleve } from '../eleve_types'
import { EleveForm } from './eleve_form'
import ModalHandleDelete from '@/components/ModalHandleDelete'
import { SchoolCertificate } from './certificat'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useAnneeStore } from '@/store/anneStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
                  isLoading={createEleve.isPending}
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
                              <span className="font-mono text-sm">{
                                Matricule(student)
                            }</span>
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
                                  onClick={() => setEditingStudent(student)}
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
                                  onConfirm={()=>onDeleteStudent(student.id_eleve)}
                                  state={isUpdatePending}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
        )
      }
    </div>
  )
}
