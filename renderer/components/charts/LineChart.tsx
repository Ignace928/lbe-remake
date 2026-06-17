import React from 'react'
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export interface LineChartProps {
  data: any[]
  lines: {
    dataKey: string
    stroke?: string
    name?: string
    strokeWidth?: number
    dot?: boolean
  }[]
  xAxisDataKey: string
  width?: number
  height?: number
  title?: string
  titleColor?: string
}

export function LineChart({
  data,
  lines,
  xAxisDataKey,
  width = 800,
  height = 400,
  title,
  titleColor = 'text-slate-100'
}: LineChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${titleColor}`}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
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
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke || getChartColor(index)}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot !== false}
              name={line.name || line.dataKey}
            />
          ))}
        </ReLineChart>
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
