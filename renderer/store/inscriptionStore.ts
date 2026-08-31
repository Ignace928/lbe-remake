import { create } from "zustand"
import { Inscription } from "@/features/inscriptions/inscription_types"
//→
interface InscriptionAction{
  select: (inscription: Inscription) => void
  clear: () => void
}
type InscriptionStore = {
  selected: Inscription | null
  action:InscriptionAction
}

const useInscriptionStore = create<InscriptionStore>((set) => ({
  selected: null,
  action:{
    select: (inscription) => set({ selected: inscription }),
    clear: () => set({ selected: null }),
  }
}))

export const useSetInscription = () => useInscriptionStore((state)=>state.action)

export const useSelectedInscription = () => useInscriptionStore((state) => state.selected)


export const useIsInscriptionDetailOpen = () => useInscriptionStore((state) => state.selected !== null)