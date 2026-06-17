import { create } from "zustand"
import { Inscription } from "@/features/inscriptions/inscription_types"
//→
type InscriptionStore = {
  selected: Inscription | null
  select: (inscription: Inscription) => void
  clear: () => void
}

export const useInscriptionStore = create<InscriptionStore>((set) => ({
  selected: null,
  select: (inscription) => set({ selected: inscription }),
  clear: () => set({ selected: null }),
}))

export const useClearSelectedInscription = () => useInscriptionStore((e)=>e.clear)

export const useSelectedInscription = () =>
  useInscriptionStore((state) => state.selected)

export const useSelectInscription = ()=> useInscriptionStore((s)=>s.select)

export const useIsInscriptionDetailOpen = () =>
  useInscriptionStore((state) => state.selected !== null)