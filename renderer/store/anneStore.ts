import { create } from "zustand";
import {devtools, persist, createJSONStorage} from 'zustand/middleware'

//STORE POUR page active dans /engineering
interface AnneeState {
  anne_Active: {
    id_anne:number | null
    labelle:string
  }
  setAnne_active: (anne: {id_anne:number | null, labelle:string}) => void;
}
export const useAnneeStore = create<AnneeState>()(
    persist((set) => ({
        anne_Active: {
            id_anne:null,
            labelle:''
        },
        setAnne_active: (page) => set({ anne_Active: page }),
        
    }),{
        name:"anneScolaire",
        storage: createJSONStorage(() => sessionStorage) // Utiliser sessionStorage comme authStore
    })
)