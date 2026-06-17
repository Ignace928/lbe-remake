import { Award, ChefHat, ChessKnight, Loader2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUpdateClasseMutation } from "@/features/classes/classe_VModel"
import { Classe, UpdateClasse } from "@/features/classes/classe_types"
import { playSound } from "@/lib/soundSystem"

type DelegueField = "delegue_1" | "delegue_2" | "meilleur_eleve"

const ROLE_CONFIG: {
  field: DelegueField
  label: string
  Icon: typeof ChefHat
}[] = [
  { field: "delegue_1", label: "Délégué 1", Icon: ChefHat },
  { field: "delegue_2", label: "Délégué 2", Icon: ChessKnight },
  { field: "meilleur_eleve", label: "Meilleur élève", Icon: Award },
]

interface SummaryStudentProps {
  classe: Classe
  eleveId: number
  onClasseUpdated?: (classe: Classe) => void
}

export function SummaryStudent({
  classe,
  eleveId,
  onClasseUpdated,
}: SummaryStudentProps) {
  const updateClasse = useUpdateClasseMutation()
  const assignRole = async (field: DelegueField, label: string) => {
    try {
      const result = await updateClasse.mutateAsync({
        id: classe.id_classe,
        data: { [field]: eleveId } as UpdateClasse,
      })
      onClasseUpdated?.(result.data)
      playSound("success.wav")
      toast.success(`${label} mis à jour`, {
        description: `L'élève a été assigné comme ${label.toLowerCase()} pour ${classe.nom_classe}.`,
      })
    } catch (error) {
      const message =
      error instanceof Error ? error.message : "Mise à jour impossible"
      toast.error("Erreur", { description: message })
    }
  }
  const unAssinMark = async (field: DelegueField, label: string) => {
    try {
      const result = await updateClasse.mutateAsync({
        id: classe.id_classe,
        data: { [field]: null } as UpdateClasse,
      })
      onClasseUpdated?.(result.data)
      playSound("success.wav")
      toast.warning(`${label} mis à jour`, {
        description: `L'élève n'est plus ${label.toLowerCase()} pour ${classe.nom_classe}.`,
      })
    } catch (error) {
      const message =
      error instanceof Error ? error.message : "Mise à jour impossible"
      toast.error("Erreur", { description: message })
    }
  }
  
  return (
    <div
    className="flex flex-row gap-2 rounded-full border border-primary p-2 backdrop-blur-2xl"
    title="Rôles de classe"
    >
      {ROLE_CONFIG.map(({ field, label, Icon }) => {
        const isActive = Number(classe[field as keyof Classe]) === Number(eleveId)
        return (
          <button
            key={field}
            type="button"
            disabled={updateClasse.isPending}
            onClick={() => {
              if(isActive){
                unAssinMark(field, label)
              }else assignRole(field, label)
            }}
            className={cn(
              "rounded-full p-1 transition-all duration-200 hover:scale-125 disabled:opacity-50",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-primary/15 hover:text-primary"
            )}
            aria-label={`Définir comme ${label}`}
          >
            {updateClasse.isPending ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Icon size={40} className={isActive ? "" : ""} />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function SummaryStudentSmall({ classe, eleveId }: SummaryStudentProps){
  
  // ROLE_CONFIG.map(({ field, label, Icon }) => {
  //     const isActive = classe[field] === eleveId
  //     return (
  //       <div className="flex flex-row gap-2 rounded-full border border-primary p-2 backdrop-blur-2xl">
  //           <Icon size={18} className={isActive ? "flex" : "hidden"} />
  //       </div>
  //     )})
  return (
    <>
      {
        ROLE_CONFIG.map(({ field, label, Icon }) => {
          const isActive = Number(classe[field as keyof Classe]) === Number(eleveId)
          return (
            <div key={field} className={`${isActive ? "flex flex-row gap-2 rounded-full border border-primary p-2 backdrop-blur-2xl" : "hidden"} `}>
              <Icon size={18} />
            </div>
          )
        })
      }
    </>
    
  )
}
