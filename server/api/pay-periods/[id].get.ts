export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Mock pay period data
  const mockPayPeriods: Record<string, any> = {
    'current-period-1': {
      id: 'current-period-1',
      startDate: '2024-12-01T00:00:00Z',
      endDate: '2024-12-15T23:59:59Z',
      totalHours: 80,
      userId: 'default-user',
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z'
    },
    'previous-period-1': {
      id: 'previous-period-1', 
      startDate: '2024-11-15T00:00:00Z',
      endDate: '2024-11-30T23:59:59Z',
      totalHours: 80,
      userId: 'default-user',
      createdAt: '2024-11-15T00:00:00Z',
      updatedAt: '2024-11-15T00:00:00Z'
    },
    'period-nov-1-15': {
      id: 'period-nov-1-15',
      startDate: '2024-11-01T00:00:00Z', 
      endDate: '2024-11-15T23:59:59Z',
      totalHours: 80,
      userId: 'default-user',
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-11-01T00:00:00Z'
    }
  }

  const payPeriod = mockPayPeriods[id as string]
  
  if (!payPeriod) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pay period not found'
    })
  }

  return {
    success: true,
    data: payPeriod
  }
})