// Time calculation utilities for Paylocity Allocation Assistant

/**
 * Parse time string (HH:MM) into a Date object for calculations
 */
export function parseTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * Calculate hours between start and end time
 */
export function calculateHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime)
  const end = parseTime(endTime)
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1)
  }
  
  const diffMs = end.getTime() - start.getTime()
  return diffMs / (1000 * 60 * 60) // Convert to hours
}

/**
 * Calculate expected hours for a cost center based on percentage
 */
export function calculateExpectedHours(percentage: number, totalHours: number): number {
  return (percentage / 100) * totalHours
}

/**
 * Format hours to display with 2 decimal places
 */
export function formatHours(hours: number): string {
  return hours.toFixed(2)
}

/**
 * Validate time format (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

/**
 * Check if start time is before end time
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return false
  }
  
  const start = parseTime(startTime)
  const end = parseTime(endTime)
  
  return start < end
}

/**
 * Get allocation status based on variance
 */
export function getAllocationStatus(actual: number, expected: number): 'under' | 'over' | 'exact' | 'close' {
  const variance = Math.abs(actual - expected)
  const threshold = expected * 0.05 // 5% tolerance
  
  if (variance === 0) return 'exact'
  if (variance <= threshold) return 'close'
  if (actual < expected) return 'under'
  return 'over'
}