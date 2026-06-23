import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, buttonVariants, Input } from '@/components/ui'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useEffect } from 'react'
import { createPaiementSchema, CreatePaiementType, UpdatePaiementType } from '../payement.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePayementVM } from '../payement_VModel';
import { SelectFrais } from '@/components/frais/frais_select';
import { Card } from '@/components/ui/card';
import { useSelectedInscription } from '@/store/inscriptionStore';
import { toast } from 'sonner';
import { useInscriptionQuery } from '@/features/inscriptions/inscription_VModel';
import { BadgeDollarSign, PlusCircle, X } from 'lucide-react';
import { nombre } from '@/lib/convertisseur';
// ref: z.string(),
//     id_inscription: z.number(),
//     id_type_frais: z.number(),
//     montant_paye: z.float64()
//         .min(1, "Le payement minimum est de 1Ar")
//         .max(999999999999999.99, "Montant irréaliste"),
//     date_paiement: z.date().optional()



export default function Payement_form({id}:{id:number}){

    const {createPayement} = usePayementVM()
    const inscription = useSelectedInscription()
    const {register, handleSubmit, setValue, getValues, watch, formState:{errors}, reset} = useForm<CreatePaiementType>({
        resolver:zodResolver(createPaiementSchema),
    })
    useEffect(()=>{
        setValue("id_inscription", inscription?.id_inscription)
    },[inscription])
    const handleCreate = handleSubmit(async (d) => {
        const ref = watch("ref")
        const payement = {
            ...d,
            ref:`${inscription.id_inscription}-${ref}`
        }
        try {
            await createPayement.mutateAsync(payement)
            toast.success("Payement céffectué avec succès",{
                description:`REF: ${watch("ref")}`
            })
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors du payement"
            toast.error(errorMessage)
        }
        reset({
            id_inscription:id,
            montant_paye:undefined,
            id_type_frais:0,
            ref:""
        })
    })
  return (
    <AlertDialog>
        <AlertDialogTrigger>
            <Card className={buttonVariants({variant:"default"})}><PlusCircle/>Add Payement<BadgeDollarSign/></Card>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-2xl text-foreground">
            <AlertDialogHeader>
                <AlertDialogTitle className='flex justify-between items-center'>
                    <p>
                        Effectuer un payement
                    </p>
                    <AlertDialogCancel className='rounded-full w-10 h-10 items-center'>x</AlertDialogCancel>
                </AlertDialogTitle>
                <AlertDialogDescription className='font-semibold text-foreground font-serif'>
                    Interessé : {inscription.eleve.nom_eleve} {inscription.eleve.post_nom_eleve}
                </AlertDialogDescription>
            </AlertDialogHeader>
            
                <form onSubmit={handleCreate}>
                {errors.id_inscription && (
                    <p className='text-sm text-red-500'>{errors.id_inscription.message}</p>
                )}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                        <div className="space-y-2">
                            <label htmlFor="montant" className="flex gap-4 items-center text-sm font-medium">
                                Montant*
                            </label>
                            <Input
                                id="montant"
                                type="number"
                                step="1"
                                placeholder="0.00"
                                {...register("montant_paye", { valueAsNumber: true })}
                                className={errors.montant_paye ? 'border-red-500' : 'border-primary'}
                            />
                            <p className="text-lg font-semibold">{nombre.formatMontant(getValues("montant_paye")||0)} Ar</p>
                            {errors.montant_paye && (
                                <p className='text-sm text-red-500'>{errors.montant_paye.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="id_type_frais" className="text-sm font-medium">
                                Raison*
                            </label>
                            <SelectFrais currentFrais={watch("id_type_frais")?.toString()||""} Click={(e)=>{setValue("id_type_frais", parseInt(e), {shouldValidate:true})}}/>
                            {errors.id_type_frais && (
                                <p className='text-sm text-red-500'>{errors.id_type_frais.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="ref" className="text-sm font-medium">
                                -Ref-
                            </label>
                            <Input
                                id="montant"
                                type="text"
                                {...register("ref")}
                                className={errors.ref ? 'border-red-500' : 'border-primary'}
                            />
                            {errors.ref && (
                                <p className='text-sm text-red-500'>{errors.ref.message}</p>
                            )}
                        </div>
                    </section>

                    <div className='mt-4 flex gap-4'>
                        <Button type='submit'>Effectuer <BadgeDollarSign/></Button>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                    </div>
                    
                </form>
                

        </AlertDialogContent>
    </AlertDialog>
  )
}
