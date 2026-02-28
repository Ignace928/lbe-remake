import React from 'react'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export interface BarChartProps {
  data: any[]
  bars: {
    dataKey: string
    fill?: string
    name?: string
  }[]
  xAxisDataKey: string
  width?: number
  height?: number
  title?: string
  titleColor?: string
  layout?: 'horizontal' | 'vertical'
}

export function BarChart({
  data,
  bars,
  xAxisDataKey,
  width = 800,
  height = 400,
  title,
  titleColor = 'text-slate-100',
  layout = 'vertical'
}: BarChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${titleColor}`}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout={layout}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-700" />
          {layout === 'vertical' ? (
            <>
              <XAxis 
                dataKey={xAxisDataKey} 
                className="stroke-slate-400"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                className="stroke-slate-400"
                tick={{ fill: '#9ca3af' }}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                className="stroke-slate-400"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                dataKey={xAxisDataKey}
                className="stroke-slate-400"
                tick={{ fill: '#9ca3af' }}
                type="category"
              />
            </>
          )}
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
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.fill || getChartColor(index)}
              name={bar.name || bar.dataKey}
            />
          ))}
        </ReBarChart>
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
