// Core data types for Paylocity Allocation Assistant

export interface User {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
}

export interface CostCenter {
  id: string
  division: number
  funding: number
  program: number
  percentage: number
  userId?: string
}

export interface PayPeriod {
  id: string
  startDate: Date
  endDate: Date
  totalHours: number
  userId?: string
  createdAt: Date
  updatedAt: Date
}

export interface TimeEntry {
  id: string
  date: Date
  startTime: string // HH:MM format
  endTime: string   // HH:MM format
  calculatedHours: number
  costCenterId: string
  payPeriodId: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

// Computed types for UI
export interface AllocationSummary {
  costCenter: CostCenter
  expectedHours: number
  actualHours: number
  variance: number
  percentageComplete: number
  status: 'under' | 'over' | 'exact' | 'close'
}

export interface DayTimeEntry {
  date: string
  entries: TimeEntry[]
  totalHours: number
}

// Form types
export interface CostCenterFormData {
  division: number | null
  funding: number | null
  program: number | null
  percentage: number | null
}

export interface PayPeriodFormData {
  startDate: string
  endDate: string
  totalHours: number | null
}

export interface TimeEntryFormData {
  date: string
  startTime: string
  endTime: string
  costCenterId: string
}

// Validation types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: ValidationError[]
}