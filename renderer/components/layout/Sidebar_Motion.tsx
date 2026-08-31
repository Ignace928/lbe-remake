import React from 'react'
import { BookMarkedIcon, ChevronRightCircle, DollarSignIcon, GraduationCapIcon, LayoutDashboard, LayoutDashboardIcon, LucideIcon, LucideUsers, Wallet } from 'lucide-react'
import { useRouter } from 'next/router'
import {motion} from "framer-motion"
import { Card } from '../ui/card'
import { useSetInscription } from '@/store/inscriptionStore'

const enfant = {
    hidden: { opacity: 0},
    visible: { opacity: 1, scale:[0,1], transition:{duration:0.1} }
}
const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren:0.09, delayChildren:0 }  }
}

type Props = {
  current:string
}

export default function SidebarMotion({current}: Props) {
    
    const menu = [
        {
          title: 'Vue',
          icon: LayoutDashboardIcon,
          route:'/dashboard',
        },
        {
          title: 'Classes',
          icon: BookMarkedIcon,
          route:'/classe',
        },
        {
          title: 'Elèves',
          icon: LucideUsers,
          route:'/etudiant',
        },
        {
          title: 'Inscriptions',
          icon: GraduationCapIcon,
          route:'/inscription',
        },
        {
          title: 'Frais & Tarifs',
          icon: Wallet,
          route:'/frais',
        },
        {
          title: 'Payements',
          icon: DollarSignIcon,
          route:'/paiements/addNew',
        }
      ]
    
  return (
    <section
        className='absolute left-0 top-0 z-4 flex bg-sidebar-primary/5 hover:backdrop-blur-xs h-full'
    >
        <div className='flex items-center justify-center'>
            {/* Les raccourci */}
            <div className='group hover:h-full flex justify-center items-center'>
              <motion.div 
                  variants={container}
                  whileInView="visible" 
                  initial="hidden"
                  className='hidden group-hover:flex justify-center flex-col gap-2 h-full border-none'
              > 
                      {
                          menu.map((m)=>(
                              <motion.div key={m.route} 
                                  variants={enfant}
                                  className='px-4'
                              >
                                  <CardSidebar active={current} title={m.title} icn={m.icon} route={m.route} />
                              </motion.div>
                          ))
                      }
                      
              </motion.div>
              <ChevronRightCircle className='group-hover:opacity-50 text-foreground opacity-20' />
            </div>
        </div>
    </section>
  )
}


type CardSidebarProps = {
    icn:LucideIcon
    title:string
    route:string
    active?:string
}

const CardSidebar = ({icn:Icon, title, route, active}: CardSidebarProps) => {
    const router = useRouter()
    const {clear} = useSetInscription()
    const navigate = ()=>{
      clear()
      router.push(route)
    }
    const isActive = active===route ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold":"bg-sidebar text-sidebar-foreground"
  return (
    
    <Card onClick={navigate} className={`flex hover:scale-108 cursor-pointer transition-transform duration-150 gap-2 p-4 border-none ${isActive}`}>
      <div><Icon/></div>
      <p>{title}</p>
    </Card>
  )
}