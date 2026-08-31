<<<<<<< HEAD

import ModeRoundedSwitcher from "../modeChooseRound"
import ThemeSwitcher from "../themeChoose"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, buttonVariants } from "../ui"
import { LogOutIcon, PowerCircle} from "lucide-react"
import { LogoutButton } from "../LogoutButton"
import { useAnneeStore } from "@/store/anneStore"
import { useRouter } from "next/router"
import Image from "next/image"
=======
import ModeSwitcher from "../modeChoose"
import ModeRoundedSwitcher from "../modeChooseRound"
import ThemeSwitcher from "../themeChoose"
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

export function HeaderComponent({
  children,
  title,
}: { children?: React.ReactNode, title: string }) {
  const path = useRouter().pathname
  console.log(path)
  const {anne_Active, setAnne_active} = useAnneeStore()
  const headerButton = () => {
    if(path==="/home"){
      return(
        <AlertDialog>
          <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'rounded-b-full rounded-t-full'})}`}>
              <p className="flex items-center gap-2">
                Quitter
                <PowerCircle/>
              </p>
          </AlertDialogTrigger>
          <AlertDialogContent className='border border-primary text-foreground'>
            <AlertDialogHeader className='text-2xl'>
                <AlertDialogTitle>Quitter et/ou Fermer session?</AlertDialogTitle>
            </AlertDialogHeader>
            
            <AlertDialogDescription className='text-lg text-semibold'>Voulez-vous fermer la session {anne_Active.labelle} et/ou vous deconnecter 💤?</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({variant:'secondary', className:"rounded-full"})}>Annuler</AlertDialogCancel>

              <AlertDialogAction className='rounded-full cursor-pointer' onClick={()=>{
                setAnne_active({id_anne:null, labelle:""})
              }}>
                Fermer session
              </AlertDialogAction>
              
                <LogoutButton  className='rounded-full cursor-pointer' variant='default'/>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
    else if(path==="/start"){
      return(
        <AlertDialog>
          <AlertDialogTrigger className={`${buttonVariants({variant:"default", className:'m-1 h-10 w-10 rounded-b-full rounded-t-full'})}`}>
                  <LogOutIcon/>
          </AlertDialogTrigger>
          <AlertDialogContent className='border border-primary text-foreground'>
              <AlertDialogHeader className='text-2xl'>
                  <AlertDialogTitle>
                      Se deconnecter
                  </AlertDialogTitle>
              </AlertDialogHeader>
            
            <AlertDialogDescription className='text-semibold text-lg'>Voulez-vous vous deconnecter 💤?</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({variant:'secondary', className:'rounded-full'})}>Annuler</AlertDialogCancel>

              <LogoutButton  className='rounded-full cursor-pointer' variant='default'/>
      
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
    else("")
  }
  return (
    <header className='w-full rounded-2xl border-secondary text-primary shadow-sm backdrop-blur-xl'>
      <div className='flex min-h-14 w-full items-center gap-2 px-3 sm:px-4 lg:px-6'>
<<<<<<< HEAD
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/benjamin.png" alt="lbe" height={20} width={20}/>
          <h1 className='truncate text-base font-semibold sm:text-lg'>{title}</h1>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          {children}
          {headerButton()}
=======
        <h1 className='truncate text-base font-semibold sm:text-lg'>{title}</h1>
        <div className='ml-auto flex items-center gap-2'>
          {children}
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
          <ThemeSwitcher/>
          <ModeRoundedSwitcher/>
        </div>
      </div>
<<<<<<< HEAD
      <div className='h-px w-full bg-linear-to-r from-primary via-transparent to-primary' />
=======
      <div className='h-px w-full bg-gradient-to-r from-primary via-transparent to-primary' />
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    </header>
  )
}