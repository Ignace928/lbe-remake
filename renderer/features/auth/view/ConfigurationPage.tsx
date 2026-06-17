import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { playSound } from "@/lib/soundSystem"
import { AlertTriangle, DatabaseZap } from "lucide-react"
import Head from "next/head"
import React, { useState } from "react"
import {motion} from 'framer-motion'
import { useSyncDatabaseMutation } from "@/features/database/database_VModel"
import { toast } from "sonner"
import { useLoginMutation } from "../auth_VModel"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger, Input } from "@/components/ui"
import { AlertDialogAction, AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"

export const ConfigurationPage = ({description} : {description:string}) => {
  const [state, setState] = useState<boolean>(false) 
  const sync = useSyncDatabaseMutation()
  const login = useLoginMutation()
  const {
      register,
      handleSubmit,
      getValues,
      reset,
      formState: { errors }
    } = useForm<{activator:string}>({
      mode: 'onChange'
    })
    
  function initialisation(){
    const a = getValues("activator")
    if(!a) return
    else if(a=="203011037146*"){
      setState(true)
      setTimeout(()=>{
        // window.location.href = '/admin'
        const initToast = toast.loading("Initialisation de la base de données...")
        sync.mutateAsync().then((a)=>{
          if(a.success){
            toast.loading(`Initialisation de l'uitilisateur...`, {
              description: `Connection de Necro...`,
              id: initToast
            })
            login.mutateAsync({nom_user:"Necro", mdp:""})
              .then((a)=>{
                if(a.success){
                  toast.success("Connection établie",{id:initToast})
                }
              })
  
          }
        })
  
      }, 3000)
      playSound('UI209.wav')
    }else{
      reset()
      toast.error("Invalide code d'initialisation")
    }
  }

  if( state ) return(
    <motion.section
      
      className='flex justify-center items-center w-full h-screen'>
      <Card className="flex p-6 text-center z-4 items-center border-none w-80 rounded-full shadow-2xs shadow-primary h-80 text-3xl animate-pulse font-stretch-ultra-expanded">
        Bienvenue Necro✨
      </Card>
      <Card className="absolute p-6 text-center items-center border-b-none z-0 bg-none border-l-none border-primary w-80 rounded-full shadow-2xs shadow-primary h-80 text-3xl animate-spin font-stretch-ultra-expanded">
        
      </Card>
    </motion.section>
  )
  else
  return(
      <React.Fragment>
          <Head>
            <title>Configuration requise - LBE Schoolar</title>
          </Head>
          
          <ScrollArea className="p-4 space-y-6 h-screen">
            <CardContent className="flex items-center justify-center min-h-full">
              <Card className="w-full max-w-md m-4 border-orange-200">
                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-orange-800">Configuration requise</CardTitle>
                  <p className="text-sm text-orange-700">
                    La base de données n'est pas synchronisée. Veuillez configurer l'application avant de continuer.
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <DatabaseZap className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Base de données non initialisée</p>
                        <p className="text-sm text-orange-700 mt-1">
                          {description || "La synchronisation est nécessaire pour utiliser l'application."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3">
                  
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full rounded-lg cursor-pointer flex items-center justify-center p-2 gap-4 bg-orange-600 hover:bg-orange-700">
                      <DatabaseZap className="mr-2 animate-pulse" />
                      Entrer code d'initialisation
                    </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Initialisation</AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                        <div className="flex gap-4">
                          <Input className="font-bold" {...register("activator")}/>
                          <AlertDialogCancel onClick={()=>{
                            handleSubmit(initialisation)()
                            onclose
                          }}>
                            Activer
                          </AlertDialogCancel>
                        </div>
                      </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Actualiser
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </ScrollArea>
        </React.Fragment>
  )
}
