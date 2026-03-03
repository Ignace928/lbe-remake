import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface MiniCardProps {
  title: string
  description: string
  icon: LucideIcon
  action: () => void
}

export function MiniCard({ title, description, icon: Icon, action }: MiniCardProps) {
  return (
    <Card
      className='group h-full min-h-36 cursor-pointer border-primary text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
      onClick={action}
      role='button'
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          action()
        }
      }}
    >
      <CardContent className='flex items-center gap-3 p-4 sm:p-5'>
        <div className='rounded-full bg-sidebar-accent p-2 text-sidebar-accent-foreground transition-colors group-hover:text-sidebar-primary-foreground group-hover:bg-sidebar-primary'>
          <Icon className='h-5 w-5 sm:h-6 sm:w-6' />
        </div>
        <span className='font-semibold'>{title}</span>
      </CardContent>
      <CardDescription className='px-4 pb-4 text-left text-sm leading-relaxed sm:px-5 sm:pb-5'>
        {description}
      </CardDescription>
    </Card>
  )
}
