import React, { useEffect, useState } from 'react'
import { ClassePicker } from '../classe/ClassePicker'
import { useInscriptionQuery } from '@/features/inscriptions/inscription_VModel'
import { useAnneeStore } from '@/store/anneStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ScrollArea } from '../ui/scroll-area'
import { Loader2, PlayIcon } from 'lucide-react'
import { useSelectedInscription, useSetInscription } from '@/store/inscriptionStore'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { SelectClasse } from '../classe/classe_select'
import { nombre } from '@/lib/convertisseur'
import { EleveInscritPicker } from './inscription_picker'
import { Inscription } from '@/features/inscriptions/inscription_types'
import { Label } from '../ui/label'

export default function InscriptionListPicker() {
    const anne = useAnneeStore().anne_Active.id_anne
    const [id_classe, setIdClasse] = useState(null)
    const {data:list, isLoading, error, refetch} = useInscriptionQuery({id_classe, id_anne:anne})
    const {select:setInscription} = useSetInscription()
    const selectedInscription = useSelectedInscription()
    const inscriptionPick = (inscrit:Inscription)=>{
        setInscription(inscrit)
        setIdClasse(inscrit.classe.id_classe)
    }
    useEffect(()=>{
        refetch()
    },[id_classe])
    
    if(isLoading)return <div className='flex items-center justify-center'><Loader2 className='animate-spin'/></div>
    if(error) return <div className=''><p>Erreur lors de la récuperation des listes!!</p></div>
  return (
    <Card className='border-r-secondary rounded-none border-l-0 border-y-0 flex flex-col min-h-0 h-full p-2 overflow-hidden'>
        <CardHeader className=''>
            <section className='flex justify-between'>
                <div>
                    <Label>Par Classes</Label>
                    <SelectClasse currentClasse={id_classe?.toString()} Click={(s)=>{
                        setIdClasse(s)
                    }}/>
                </div>
                <div>
                    <Label>Elève (ID°)</Label>
                    <EleveInscritPicker
                        onInscriptionClick={inscriptionPick}
                        placeHolder='Payement de'
                        className='w-full'
                        currentStudent=''
                    />
                </div>
            </section>
        </CardHeader>
        <ScrollArea className="">

            <Table>
                <TableHeader className='relative'>
                    <TableRow className='border-primary/10 sticky top-0 hover:bg-primary/5'>
                        <TableHead className='text-foreground'>Matricule</TableHead>
                        <TableHead className='text-foreground'>Nom</TableHead>
                        <TableHead className='text-foreground'>Cummulé</TableHead>
                    </TableRow>
                </TableHeader>

                {
                    list.rows.length===0? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-sm text-center font-semibold">
                                Aucun élève trouvé😥.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ):(
                        <TableBody>
                            {
                                
                                list.rows.map((inscription)=>(
                                    <TableRow className={`border-none ${inscription.id_inscription===selectedInscription?.id_inscription ? "bg-sidebar-primary hover:text-foreground text-sidebar-primary-foreground cursor-pointer" : "cursor-pointer"}`} 
                                        onClick={()=>setInscription(inscription)} key={inscription.id_inscription}>
                                        <TableCell>{inscription.eleve.matricule}</TableCell>
                                        <TableCell className='flex items-center gap-4'>
                                            <p className='text-lg font-semibold'>
                                                {inscription.eleve.nom_eleve} 
                                            </p>
                                            <p className='font-semibold'>
                                                {inscription.eleve.post_nom_eleve}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className='text-lg' variant='outline'>{nombre.formatMontant(inscription.somme)} Ar</Badge>
                                        </TableCell>
                                        <TableCell>
                                        {
                                            inscription.id_inscription===selectedInscription?.id_inscription &&(
                                                    <PlayIcon className=''/>
                                                )
                                            }
                                        </TableCell>
                                        
                                    </TableRow>
                                ))
                                
                            }
                        </TableBody>
                    )
                }
            </Table>
        </ScrollArea>
    </Card>
  )
}
