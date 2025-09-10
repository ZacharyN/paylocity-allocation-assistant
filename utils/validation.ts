// Validation utilities for Paylocity Allocation Assistant

import { ValidationError } from '~/types'

/**
 * Validate email domain for Nebraska Children
 */
export function validateNebraskChildrenEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@nebraskachildren.org')
}

/**
 * Validate cost center percentages total to 100%
 */
export function validateCostCenterPercentages(percentages: number[]): boolean {
  const total = percentages.reduce((sum, percentage) => sum + percentage, 0)
  return Math.abs(total - 100) < 0.01 // Allow for floating point precision
}

/**
 * Validate that end date is after start date
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end > start
}

/**
 * Validate that a number is positive
 */
export function validatePositiveNumber(value: number): boolean {
  return value > 0
}

/**
 * Validate cost center form data
 */
export function validateCostCenter(data: {
  division: number | null
  funding: number | null
  program: number | null
  percentage: number | null
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.division || data.division < 0) {
    errors.push({ field: 'division', message: 'Division is required and must be a positive number' })
  }

  if (!data.funding || data.funding < 0) {
    errors.push({ field: 'funding', message: 'Funding is required and must be a positive number' })
  }

  if (!data.program || data.program < 0) {
    errors.push({ field: 'program', message: 'Program is required and must be a positive number' })
  }

  if (!data.percentage || data.percentage <= 0 || data.percentage > 100) {
    errors.push({ field: 'percentage', message: 'Percentage must be between 0 and 100' })
  }

  return errors
}

/**
 * Validate pay period form data
 */
export function validatePayPeriod(data: {
  startDate: string
  endDate: string
  totalHours: number | null
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' })
  }

  if (!data.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required' })
  }

  if (data.startDate && data.endDate && !validateDateRange(data.startDate, data.endDate)) {
    errors.push({ field: 'endDate', message: 'End date must be after start date' })
  }

  if (!data.totalHours || !validatePositiveNumber(data.totalHours)) {
    errors.push({ field: 'totalHours', message: 'Total hours must be a positive number' })
  }

  return errors
}

/**
 * Validate time entry form data
 */
export function validateTimeEntry(data: {
  date: string
  startTime: string
  endTime: string
  costCenterId: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' })
  }

  if (!data.startTime) {
    errors.push({ field: 'startTime', message: 'Start time is required' })
  }

  if (!data.endTime) {
    errors.push({ field: 'endTime', message: 'End time is required' })
  }

  if (data.startTime && data.endTime) {
    if (!isValidTimeFormat(data.startTime)) {
      errors.push({ field: 'startTime', message: 'Start time must be in HH:MM format' })
    }

    if (!isValidTimeFormat(data.endTime)) {
      errors.push({ field: 'endTime', message: 'End time must be in HH:MM format' })
    }

    if (isValidTimeFormat(data.startTime) && isValidTimeFormat(data.endTime)) {
      if (!isValidTimeRange(data.startTime, data.endTime)) {
        errors.push({ field: 'endTime', message: 'End time must be after start time' })
      }
    }
  }

  if (!data.costCenterId) {
    errors.push({ field: 'costCenterId', message: 'Cost center selection is required' })
  }

  return errors
}