import { EleveInscritPicker } from '@/components/inscription/inscription_picker'
import { TitleComponent } from '@/components/layout/title_component'
import { Button } from '@/components/ui'
import { useSelectedInscription, useSetInscription } from '@/store/inscriptionStore'
import { BadgeDollarSign, BookmarkXIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Payement_form from './Payement_form'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { AllPayementCard } from './AllPayementCard'
import InscriptionListPicker from '@/components/inscription/inscription_pickerList'
import { payementByIdType } from '../payement.types'
import { EditMontantPaye } from './payementEdit_form'
export default function AddNewPayement() {
    const inscription = useSelectedInscription()
    const [editPaye, setEditPaye] = useState<payementByIdType | null>(null)
    const router = useRouter()
  return (
    <div className="min-h-0 flex flex-col h-full">
        <TitleComponent Icon={BadgeDollarSign}>
            <div className='flex-1'>
                <p className='text-lg font-bold'>Effectuer un payement</p>
            </div>           
        </TitleComponent>
        <div className='h-full min-h-0 grid grid-cols-3 gap-0.5'>
          <div className='col-span-2 min-h-0'>
            
            <InscriptionListPicker/>
            
          </div>
            <Card className='border-4 border-l-secondary rounded-none border-r-0 border-y-0 flex flex-col min-h-0 h-full overflow-hidden'>
              
                <section className='w-full flex justify-between items-center'>
                  {
                    inscription && (
                      <Card className='w-full flex gap-4 p-2 m-1 justify-center border-0'>
                        <p className=''>
                          {inscription.eleve.nom_eleve} {inscription.eleve.post_nom_eleve}
                        </p>
                        <p className='font-semibold'>{inscription.classe.nom_classe}</p>
                      </Card>
                    )
                  }
                </section>
                {
                  inscription&& <AllPayementCard showPayement={setEditPaye} id_inscription={inscription.id_inscription}/>
                }
               
                
                <section className='flex px-4 p-1 shadow-2xl backdrop-blur-lg bg-red-50/5'>
                  {
                    inscription&&(
                      <div className='flex justify-between w-full'>
                        <Payement_form id={inscription.id_inscription}/>
                        <ClearBtn/>
                      </div>
                    )
                  }
                </section>
               
               
            </Card>
        </div>
        {
          editPaye && (
            <EditMontantPaye
              payement={editPaye&&{
                ref: editPaye.ref,
                id_inscription: editPaye.id_inscription,
                id_type_frais: editPaye.typeFrais.id_type_frais,
                montant_paye: editPaye.montant_paye,
                date_paiement: editPaye.date_paiement
              }}
              idpayement={editPaye.id_paiement}
              libelle={editPaye.typeFrais.libelle}
              open={editPaye!==null}
              AlertClose={()=>setEditPaye(null)}
            />
          )
        }
    </div>
  )
}
const ClearBtn = ()=>{
  const {clear} = useSetInscription()
  return(
    <Button variant="outline" className='cursor-pointer'  onClick={clear}>
      Retour
    </Button>)
}