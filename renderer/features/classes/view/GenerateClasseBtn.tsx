import { playSound } from '@/lib/soundSystem';
import React from 'react'
import { toast } from 'sonner';
import { useClasseVm } from '../classe_VModel';
import { Button } from '@/components/ui';

export default function GenerateClasseBtn() {
    const {createClasse, refetch} = useClasseVm()
    
      async function seed (){
      // Confirmation avant de lancer la création massive
      const generateTestData = () => {
          const classe = [
            {nom_classe: "Jardin d'enfant", niveau:"Préscolaire"},
            {nom_classe: "Petite section", niveau:"Préscolaire"},
            {nom_classe: "Moyenne section", niveau:"Préscolaire"},
            { nom_classe: "Seconde A", niveau: "Lycée"},
            { nom_classe: "Seconde B", niveau: "Lycée"},
            { nom_classe: "Seconde C", niveau: "Lycée"},
            { nom_classe: "Seconde OSE", niveau: "Lycée"},
            { nom_classe: "Première L", niveau: "Lycée"},
            { nom_classe: "Première S", niveau: "Lycée"},
            { nom_classe: "Terminale L", niveau: "Lycée"},
            { nom_classe: "Terminale S", niveau: "Lycée"},
            { nom_classe: "Terminale A", niveau: "Lycée"},
            { nom_classe: "Terminale C", niveau: "Lycée"},
            { nom_classe: "Terminale D", niveau: "Lycée"}
          ];
          for(let i = 12; i > 2 ; i-- ){
            classe.push({nom_classe: `${i} ème A`, niveau:`${i>6? "Primaire" : "Secondaire"}`})
            classe.push({nom_classe: `${i} ème B`, niveau:`${i>6? "Primaire" : "Secondaire"}`})
            classe.push({nom_classe: `${i} ème C`, niveau:`${i>6? "Primaire" : "Secondaire"}`})
          }
          return classe
        }
    
        toast.warning("Génération de Classe seed?", {
          description:'Confirmez ou ignoré tout simplement',
          action:{
            label:"CONFIRMER",
            onClick: async () =>{
              const loadingToast = toast.loading('Création massive de classes en cours...', {
                description: `Génération de ${generateTestData().length} classes potentiele , veuillez patienter...`
              })
          
              try {
                const testData = generateTestData()
                console.log('Début de la création massive de potentiel classe...')
                
                // Créer les étudiants un par un pour éviter les surcharges
                for (let i = 0; i < testData.length; i++) {
                  const classe = testData[i]
                  try {
                    await createClasse.mutateAsync(classe)
                    
                    // Mettre à jour le toast tous les 10 étudiants
                    if ((i + 1) % 10 === 0) {
                      toast.loading(`Création massive de classes en cours...`, {
                        description: `${i + 1}/${testData.length} classes créés...`,
                        id: loadingToast
                      })
                    }
                  } catch (error: any) {
                    console.error(`Erreur lors de la création de la classe ${i + 1}:`, error)
                    // Continuer avec les autres étudiants même si l'un échoue
                  }
                  
                  // Petit délai pour éviter la surcharge
                  await new Promise(resolve => setTimeout(resolve, 100))
                }
                
                toast.dismiss(loadingToast)
                toast.success('Création massive terminée', {
                  description: `${testData.length} Potentiel classes ont été ajoutés avec succès.`
                })
                playSound
                ('success.wav')
                refetch()
              } catch (error: any) {
                toast.dismiss(loadingToast)
                toast.error('Erreur lors de la création massive', {
                  description: error.message || 'Une erreur est survenue pendant la création massive.'
                })
                playSound('error.wav')
              }
            }
          }
        })
      }
  return (
    <Button 
        className="hover:scale-110 transition-all duration-75 cursor-pointer rounded-full w-1/2 bg-linear-30 from-emerald-500 via-sky-500 to-purple-600"
        onClick={seed}
        >
        Générer Les potentiels classes <p className="animate-ping ">✨</p>
    </Button>
  )
}
