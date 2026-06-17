import React from 'react'
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export interface AreaChartProps {
  data: any[]
  areas: {
    dataKey: string
    stroke?: string
    fill?: string
    fillOpacity?: number
    name?: string
    strokeWidth?: number
  }[]
  xAxisDataKey: string
  width?: number
  height?: number
  title?: string
  titleColor?: string
  stackId?: string
}

export function AreaChart({
  data,
  areas,
  xAxisDataKey,
  width = 800,
  height = 400,
  title,
  titleColor = 'text-slate-100',
  stackId
}: AreaChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${titleColor}`}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-700" />
          <XAxis 
            dataKey={xAxisDataKey} 
            className="stroke-slate-400"
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis 
            className="stroke-slate-400"
            tick={{ fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '6px'
            }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend 
            wrapperStyle={{ color: '#9ca3af' }}
          />
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.stroke || getChartColor(index)}
              strokeWidth={area.strokeWidth || 2}
              fill={area.fill || getChartColor(index)}
              fillOpacity={area.fillOpacity || 0.6}
              name={area.name || area.dataKey}
              stackId={stackId}
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Utiliser les couleurs définies dans globals.css
function getChartColor(index: number): string {
  const chartColors = [
    'hsl(var(--chart-1))', // Défini dans globals.css
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]
  return chartColors[index % chartColors.length]
}
