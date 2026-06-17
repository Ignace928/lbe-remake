import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, buttonVariants, Input } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { LucideBanknoteX, PenBox, X } from "lucide-react"
import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { usePayementVM, useUpdatePayement } from "../payement_VModel"
import { updatePaiementSchema, UpdatePaiementType } from "../payement.types"
import ModalHandleDelete from "@/components/ModalHandleDelete"
import { nombre } from "@/lib/convertisseur"

type EditPayementProps={
    open:boolean
    AlertClose:()=>void
    payement:UpdatePaiementType
    idpayement:number
    libelle:string
}
export const EditMontantPaye = (props: PropsWithChildren<EditPayementProps>) => {
    const {handleSubmit,register,watch,getValues, reset, formState:{errors}} = useForm<UpdatePaiementType>({
        resolver:zodResolver(updatePaiementSchema),
        defaultValues:props.payement
    })
    
    const {updatePayement, deletePayement} = usePayementVM()
    const [modif, setModif] = useState(false)
    // useEffect(()=>{reset({montant_paye:props.payement.montant_paye})},[])
    const handleUpdate = handleSubmit(async (d)=>{
        try{
            await updatePayement.mutateAsync({id_paiement:props.idpayement, paiementData:d})
            toast.success("Le montant est Mise à jour👌")
        }catch(error){
            toast.error("Erreur de Modification",{
                description:`${error.message}`||""
            })
        }
        props.AlertClose()
    })
    const handleRemboursement = async()=>{
        try {
            await deletePayement.mutateAsync(props.idpayement)
            toast.success("Le reboursement est effectué",{
                description:"Montant mise à jour!"
            })
        } catch (error) {
            toast.error("Erreur de remboursement!",{
                description:`${error.message}`||""
            })
        }
        props.AlertClose()
    }
    // const handleUpdate = handleSubmit ((d)=>{
    //     console.log(d)
    // })
  return (
    <AlertDialog open={props.open}>
        <AlertDialogTrigger className='w-full'>
            {props.children}
        </AlertDialogTrigger>
        <AlertDialogContent className='text-foreground'>
            <AlertDialogHeader>
                <AlertDialogTitle className='flex justify-between'>
                    Détails du payement
                    <AlertDialogCancel onClick={props.AlertClose} className='rounded-full w-10 h-10 border items-center'>X</AlertDialogCancel>
                </AlertDialogTitle>
                <AlertDialogDescription className='text-lg flex items-center justify-center gap-2'>
                    payé le : {props.payement.date_paiement && format(new Date(props.payement.date_paiement), "dd MMMM yyyy", { locale: fr })}                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className='flex flex-col gap-4 items-start'>
                <p className='text-sm'>Ref : {props.payement.ref}</p>
                <div className='flex items-center gap-2'>
                    <p className='text-sm'>Raison</p>
                    <Badge className='text-sm border-primary' variant='outline'>{props.libelle}</Badge>
                </div>
            </div>
                <div className='flex items-center gap-2'>
                    <p className='text-sm'>Montant</p>
                    <p className="text-lg font-semibold">{nombre.formatMontant(getValues("montant_paye")||0)} Ar</p>
                    <PenBox className="w-5 h-5 hover:scale-150 cursor-pointer" onClick={()=>setModif(!modif)}/>
                </div>
                {
                    modif&&(
                        <form onSubmit={handleUpdate}>
                            <div className='flex items-center gap-2'>
                                <Input step={1} className='border-primary/40' defaultValue={watch("montant_paye")} type='number' id='montant' {...register("montant_paye",{valueAsNumber:true})}/>
                                <Button className='cursor-pointer bg-amber-500 text-black hover:bg-amber-400' type='submit'>Appliquer<PenBox/></Button>
                            </div>
                                {errors.montant_paye && (
                                    <p className='text-sm text-red-500'>{errors.montant_paye.message}</p>
                                )}
                                {errors.date_paiement && (
                                    <p className='text-sm text-red-500'>{errors.date_paiement.message}</p>
                                )}
                        </form>                        
                    )
                }


            <AlertDialogFooter className='flex pt-8'>
                <div className="flex justify-between w-full">
                        <ModalHandleDelete 
                            onConfirm={handleRemboursement}
                            state={false}
                            btnVariant="destructive"
                            personalization="bg-red-700 text-white font-semibold"
                            title={`Rembourser ${nombre.formatMontant(props.payement.montant_paye)} Ar!!`}
                            description={`Voulez-vous annuler le payement (Ref: ${props.payement.ref}) effectué`}
                        >
                            Annuler le payement <LucideBanknoteX/>

                        </ModalHandleDelete>
                    <AlertDialogCancel onClick={props.AlertClose} className={buttonVariants({variant:"secondary", className:"border"})}>
                        Fermer <X/>
                    </AlertDialogCancel>
                </div>
                
            </AlertDialogFooter>

        </AlertDialogContent>
    </AlertDialog>
  )
}