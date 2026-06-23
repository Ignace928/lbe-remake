import React from 'react'
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

export interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  width?: number
  height?: number
  title?: string
  titleColor?: string
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  innerRadius?: number
  outerRadius?: number
}

export function PieChart({
  data,
  dataKey,
  nameKey,
  width = 800,
  height = 400,
  title,
  titleColor = 'text-slate-100',
  colors,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80
}: PieChartProps) {
  // Utiliser les couleurs définies dans globals.css par défaut si non spécifiées
  const defaultColors = [
    'hsl(var(--chart-1))', // Défini dans globals.css
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--background))',
    'hsl(var(--foreground))',
    'hsl(var(--foreground))',
  ]
  
  const pieColors = colors || defaultColors

  return (
    <div className="w-full">
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${titleColor}`}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--sidebar-primary)',
                color:'var(--foreground)',
                border: '1px solid #374151',
                borderRadius: '6px'
              }}
              labelStyle={{ color: 'var(--primary)' }}
            />
          )}
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: '#ffffff' }}
            />
          )}
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}
