import React from 'react'
import { useEleveByIdQuery } from '@/features/eleves/eleve_VModel'
import { Badge } from '@/components/ui/badge'
import { Loader, Loader2 } from 'lucide-react'

interface EleveInfoCellProps {
  eleveId: number | null
  type: 'delegue' | 'meilleur'
  delegueNumber?: 1 | 2
}

export function EleveInfoCell({ eleveId, type, delegueNumber }: EleveInfoCellProps) {
  const { data: eleve, isLoading } = useEleveByIdQuery(eleveId || 0)

  if (!eleveId) {
    return <span className="text-sm">-</span>
  }

  if (isLoading) {
    return <span className="text-sm text-muted-foreground"><Loader2 className='animate-spin'/></span>
  }

  if (!eleve) {
    return <span className="text-sm text-muted-foreground">-</span>
  }

  return (
    <div>
      <span className="text-sm">{eleve.matricule}</span>
    </div>
  )
}
