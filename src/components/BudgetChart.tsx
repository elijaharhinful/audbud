'use client'
import { BudgetChartProps } from '@/lib/types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']

export default function BudgetChart({ budgets, categorySpending, type = 'bar' }: BudgetChartProps) {
  const chartData = budgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    spent: categorySpending[budget.category] || 0,
    remaining: Math.max(0, budget.amount - (categorySpending[budget.category] || 0)),
    percentage: budget.amount > 0 ? Math.round(((categorySpending[budget.category] || 0) / budget.amount) * 100) : 0
  }))

  const pieData = chartData.map(item => ({
    name: item.category,
    value: item.spent,
    budget: item.budget
  })).filter(item => item.value > 0)

  if (type === 'pie') {
    return (
      <div className="w-full h-64">
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value = 0, budget = 0}) => `${name}: $${(value || 0).toFixed(2)} / $${budget.toFixed(2)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string, props: any) => [
                `$${value.toFixed(2)}`,
                `${name} (Budget: $${props.payload.budget.toFixed(2)})`
              ]} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No spending data to display
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            <Bar dataKey="remaining" fill="#ffc658" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No budget data to display
        </div>
      )}
    </div>
  )
}

// Budget Progress Bar Component
export function BudgetProgressBar({ budget, spent }: { budget: number, spent: number }) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const isOverBudget = spent > budget
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>${spent.toFixed(2)} spent</span>
        <span>${budget.toFixed(2)} budget</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{percentage.toFixed(1)}% used</span>
        {isOverBudget && <span className="text-red-600">Over budget!</span>}
      </div>
    </div>
  )
}