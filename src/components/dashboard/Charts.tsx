import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChartsProps } from '@/lib/types'
import { CHART_COLORS } from '../providers/ThemeProvider'

export default function Charts({ budgetVsSpent, pieData, isDark, accentColor }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Budget vs Spending
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetVsSpent}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="category" 
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#ffffff' : '#000000'
              }}
            />
            <Legend />
            <Bar dataKey="budget" fill={accentColor} name="Budget" />
            <Bar dataKey="spent" fill="#10b981" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Spending by Category
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <div className={`flex items-center justify-center h-[300px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No spending data available
          </div>
        )}
      </div>
    </div>
  )
}

