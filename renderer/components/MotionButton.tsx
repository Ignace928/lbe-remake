import React, { type ReactNode } from 'react'
import {motion} from 'framer-motion'

interface propsSmooth{
    children:ReactNode
    stiffness?:number
    damping?:number
    active?:boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export function ButtonSmooth({children, stiffness=300, active=false, damping=15 ,  onClick}:propsSmooth){
    
    return (
        <motion.button
            onClick={onClick}
            whileHover={{
                scale:1.07,
                y:-2
            }}
            whileTap={{
                scale:0.9,
                y:1
            }}
            transition={{type:"spring", stiffness, damping}}
            className={`${active? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"} transition-colors duration-500 hover:cursor-pointer inline-flex shrink-0 items-center justify-center rounded-lg p-2 border border-transparent bg-clip-padding text-lg font-medium whitespace-nowrap`}
        >
            {children}
        </motion.button>
    )
}