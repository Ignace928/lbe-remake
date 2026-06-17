
import React, { KeyboardEventHandler } from 'react'
import { Input } from './ui'
import { Search } from 'lucide-react'
import { playSound } from '@/lib/soundSystem'

interface SearchInput {
  setSearchTerm: (e:string)=>void
  searchTerm: string
  label: string
}

export function SearchInput({ setSearchTerm, searchTerm, label }: SearchInput) {    
  return (
    <div className='relative lg:col-span-2'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <div className='rounded-full bg-linear-to-r from-primary to-secondary p-1.5 shadow-lg shadow-primary/20'>
            <Search className='h-4 w-4 text-primary-foreground' />
        </div>
        </div>
        <Input
            placeholder={` ${label || "Rechercher"}`}
            value={searchTerm}
            onChange={(event) => 
                {
                    setSearchTerm(event.target.value)
                    playSound('chat1.wav')
                }
            }
            className='pl-12 border-2 border-primary/20 bg-linear-to-r from-muted/50 to-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl'
        />
    </div>
    
  )
}



