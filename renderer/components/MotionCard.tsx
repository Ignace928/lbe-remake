import React, { type ReactNode } from 'react'
import { motion } from "framer-motion"
import { Card, CardContent } from './ui/card'

interface smoothCardProps{
    children:ReactNode
    style: string
    staggerChildren?: number
    delay?:number
}

export function SmoothCard({children, style, staggerChildren=1, delay=1}:smoothCardProps) {
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren, delayChildren:delay }  }
    }
  return (
        <Card className="border-none bg-card/5 backdrop-blur-xs px-2">
            <motion.section variants={container} initial="hidden" animate='visible'>
                <CardContent className={`${style}`}>
                        {children}
                </CardContent>
            </motion.section>
        </Card>
  )
}
