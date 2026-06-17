import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface CardChartProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  titleColor?: string
}

export function CardChart({ 
  title, 
  description, 
  children, 
  className = '',
  titleColor = 'text-slate-100'
}: CardChartProps) {
  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${titleColor}`}>
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-slate-400 mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  )
}
