// // src/components/BudgetSetupForm.tsx
// 'use client'
// import { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { AppDispatch } from '@/store'
// import { createBudget, updateBudget } from '@/store/budgetSlice'
// import { Plus, Trash2, Calculator, DollarSign } from 'lucide-react'

// interface BudgetCategory {
//   id?: string
//   category: string
//   amount: number
//   isNew?: boolean
// }

// interface BudgetSetupFormProps {
//   existingBudgets?: BudgetCategory[]
//   onComplete?: () => void
//   userId: string
// }

// const DEFAULT_CATEGORIES = [
//   'Food & Dining',
//   'Transportation',
//   'Shopping',
//   'Entertainment',
//   'Bills & Utilities',
//   'Healthcare',
//   'Education',
//   'Travel',
//   'Other'
// ]

// const LIFESTYLE_QUESTIONS = [
//   {
//     id: 'income',
//     question: 'What is your monthly income?',
//     type: 'number',
//     placeholder: '5000'
//   },
//   {
//     id: 'dependents',
//     question: 'How many dependents do you have?',
//     type: 'number',
//     placeholder: '0'
//   },
//   {
//     id: 'housing',
//     question: 'What is your monthly housing cost?',
//     type: 'number',
//     placeholder: '1500'
//   },
//   {
//     id: 'savings_goal',
//     question: 'What percentage of income do you want to save?',
//     type: 'number',
//     placeholder: '20'
//   }
// ]

// export default function BudgetSetupForm({ existingBudgets = [], onComplete, userId }: BudgetSetupFormProps) {
//   const dispatch = useDispatch<AppDispatch>()
//   const [step, setStep] = useState<'lifestyle' | 'categories' | 'review'>('lifestyle')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   // Lifestyle data
//   const [lifestyleData, setLifestyleData] = useState({
//     income: '',
//     dependents: '',
//     housing: '',
//     savings_goal: '20'
//   })
  
//   // Budget categories
//   const [budgets, setBudgets] = useState<BudgetCategory[]>(
//     existingBudgets.length > 0 
//       ? existingBudgets 
//       : DEFAULT_CATEGORIES.map(cat => ({ category: cat, amount: 0, isNew: true }))
//   )

//   const handleLifestyleChange = (id: string, value: string) => {
//     setLifestyleData(prev => ({ ...prev, [id]: value }))
//   }

//   const generateSuggestedBudgets = () => {
//     const income = parseFloat(lifestyleData.income)
//     const housing = parseFloat(lifestyleData.housing)
//     const savingsGoal = parseFloat(lifestyleData.savings_goal) / 100
    
//     if (!income || income <= 0) {
//       setError('Please enter a valid monthly income')
//       return
//     }

//     // Calculate available amount after savings and housing
//     const savingsAmount = income * savingsGoal
//     const availableForCategories = income - housing - savingsAmount

//     // 50/30/20 rule adaptation
//     const suggestions = {
//       'Food & Dining': availableForCategories * 0.25,
//       'Transportation': availableForCategories * 0.15,
//       'Shopping': availableForCategories * 0.10,
//       'Entertainment': availableForCategories * 0.10,
//       'Bills & Utilities': availableForCategories * 0.20,
//       'Healthcare': availableForCategories * 0.08,
//       'Education': availableForCategories * 0.05,
//       'Travel': availableForCategories * 0.05,
//       'Other': availableForCategories * 0.02
//     }

//     setBudgets(prev => prev.map(budget => ({
//       ...budget,
//       amount: suggestions[budget.category] || budget.amount
//     })))

//     setStep('categories')
//   }

//   const addCategory = () => {
//     setBudgets(prev => [...prev, { category: '', amount: 0, isNew: true }])
//   }

//   const removeCategory = (index: number) => {
//     setBudgets(prev => prev.filter((_, i) => i !== index))
//   }

//   const updateBudgetAmount = (index: number, amount: number) => {
//     setBudgets(prev => prev.map((budget, i) => 
//       i === index ? { ...budget, amount } : budget
//     ))
//   }

//   const updateBudgetCategory = (index: number, category: string) => {
//     setBudgets(prev => prev.map((budget, i) => 
//       i === index ? { ...budget, category } : budget
//     ))
//   }

//   const handleSubmit = async () => {
//     setIsLoading(true)
//     setError('')

//     try {
//       // Validate budgets
//       const validBudgets = budgets.filter(b => b.category && b.amount > 0)
      
//       if (validBudgets.length === 0) {
//         setError('Please add at least one budget category')
//         setIsLoading(false)
//         return
//       }

//       // Save budgets
//       for (const budget of validBudgets) {
//         if (budget.id) {
//           await dispatch(updateBudget({
//             id: budget.id,
//             category: budget.category,
//             amount: budget.amount
//           })).unwrap()
//         } else {
//           await dispatch(createBudget({
//             userId,
//             category: budget.category,
//             amount: budget.amount
//           })).unwrap()
//         }
//       }

//       onComplete?.()
//     } catch (err: any) {
//       setError(err.message || 'Failed to save budgets')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
//   const income = parseFloat(lifestyleData.income) || 0
//   const budgetPercentage = income > 0 ? (totalBudget / income) * 100 : 0

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-center space-x-4">
//           {['lifestyle', 'categories', 'review'].map((stepName, index) => (
//             <div key={stepName} className="flex items-center">
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 step === stepName ? 'bg-blue-600 text-white' : 
//                 ['lifestyle', 'categories', 'review'].indexOf(step) > index ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
//               }`}>
//                 {index + 1}
//               </div>
//               {index < 2 && <div className="w-12 h-0.5 bg-gray-300 mx-2" />}
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-2 text-sm text-gray-600 capitalize">
//           {step === 'lifestyle' && 'Lifestyle Assessment'}
//           {step === 'categories' && 'Budget Categories'}
//           {step === 'review' && 'Review & Save'}
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}
//     </div>
//     )
// }