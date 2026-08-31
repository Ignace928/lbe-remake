import { create } from "zustand"


interface exploreAction{
    explore:(s:string)=>void
    reset_viz:()=>void
}
type explorationStore = {
    visualize:string | null
    action:exploreAction
}

const useExplorationStore = create<explorationStore>((set)=>({
    visualize:null,
    action:{
        explore:(s)=>set({visualize:s}),
        reset_viz:()=>set({visualize:null})
    }
}))
export const useExplore = () => useExplorationStore((state)=>state.action)
export const useVisual = () => useExplorationStore((state)=>state.visualize)