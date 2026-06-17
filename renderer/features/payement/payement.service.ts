import { CreatePaiementType, payementByIdType, UpdatePaiementType } from "./payement.types"

interface payementType{
  id_paiement: number,
  ref: string,
  id_inscription: number,
  id_type_frais: number,
  montant_paye: number,
  date_paiement: Date,
}
export const api = {
  getAllByInscription: async (params:{id_inscription:number}) : Promise<{success: boolean; message: string; data: any}> => {
    const response = await window.ipc.paiement.getById(params) as {success:boolean, message:string, data:payementByIdType[]}
    if(!response.success){
      throw new Error(response.message)
    }
    return response
  },

  // CREATE
  create: async (data: CreatePaiementType): Promise<{success: boolean; message: string; data: any}> => {
    const response = await window.ipc.paiement.create(data) as {success:boolean, message:string,data:payementType}
    if (!response.success) {
      throw new Error(response.message)
    }
    return {
      success:response.success,
      message:response.message,
      data:response.data
    }
  },

  //UPDATE
  update: async (id_paiement: number, paiementData: UpdatePaiementType): Promise<{success:boolean, message:string, data:any}> => {
    const response = await window.ipc.paiement.update(id_paiement, paiementData) as {success:boolean, message:string, data:payementType}
    if(!response.success){
      throw new Error(response.message)
    }
    console.log(response)
    return {...response}
    
  },

  delete: async (id_paiement: number): Promise<{success:boolean, message:string, data:any}> => {
    const response = await window.ipc.paiement.delete(id_paiement) as {success:boolean, message:string, data:any}
    if(!response.success){
      throw new Error(response.message)
    }
    console.log(response)
    return {...response}
    
  }
}