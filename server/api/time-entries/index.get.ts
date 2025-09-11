export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const payPeriodId = query.payPeriodId as string
  
  // Mock time entries data based on pay period
  const mockTimeEntries: Record<string, any[]> = {
    'current-period-1': [
      {
        id: 'te-1',
        date: '2024-12-02T00:00:00Z',
        startTime: '08:00',
        endTime: '12:00',
        calculatedHours: 4,
        costCenterId: 'cc-1',
        payPeriodId: 'current-period-1',
        userId: 'default-user',
        createdAt: '2024-12-02T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z'
      },
      {
        id: 'te-2',
        date: '2024-12-02T00:00:00Z',
        startTime: '13:00',
        endTime: '17:00',
        calculatedHours: 4,
        costCenterId: 'cc-2',
        payPeriodId: 'current-period-1',
        userId: 'default-user',
        createdAt: '2024-12-02T00:00:00Z',
        updatedAt: '2024-12-02T00:00:00Z'
      },
      {
        id: 'te-3',
        date: '2024-12-03T00:00:00Z',
        startTime: '08:00',
        endTime: '16:00',
        calculatedHours: 8,
        costCenterId: 'cc-1',
        payPeriodId: 'current-period-1', 
        userId: 'default-user',
        createdAt: '2024-12-03T00:00:00Z',
        updatedAt: '2024-12-03T00:00:00Z'
      },
      {
        id: 'te-4',
        date: '2024-12-04T00:00:00Z',
        startTime: '08:00',
        endTime: '12:00',
        calculatedHours: 4,
        costCenterId: 'cc-1',
        payPeriodId: 'current-period-1',
        userId: 'default-user', 
        createdAt: '2024-12-04T00:00:00Z',
        updatedAt: '2024-12-04T00:00:00Z'
      },
      {
        id: 'te-5',
        date: '2024-12-04T00:00:00Z',
        startTime: '13:00',
        endTime: '17:30',
        calculatedHours: 4.5,
        costCenterId: 'cc-2',
        payPeriodId: 'current-period-1',
        userId: 'default-user',
        createdAt: '2024-12-04T00:00:00Z', 
        updatedAt: '2024-12-04T00:00:00Z'
      },
      {
        id: 'te-6',
        date: '2024-12-05T00:00:00Z',
        startTime: '08:00',
        endTime: '17:00',
        calculatedHours: 8,
        costCenterId: 'cc-1',
        payPeriodId: 'current-period-1',
        userId: 'default-user',
        createdAt: '2024-12-05T00:00:00Z',
        updatedAt: '2024-12-05T00:00:00Z'
      },
      {
        id: 'te-7',
        date: '2024-12-05T00:00:00Z',
        startTime: '09:00',
        endTime: '11:00',
        calculatedHours: 2,
        costCenterId: 'cc-3',
        payPeriodId: 'current-period-1',
        userId: 'default-user',
        createdAt: '2024-12-05T00:00:00Z',
        updatedAt: '2024-12-05T00:00:00Z'
      }
    ],
    'previous-period-1': [
      {
        id: 'te-p1',
        date: '2024-11-16T00:00:00Z',
        startTime: '08:00',
        endTime: '17:00',
        calculatedHours: 8,
        costCenterId: 'cc-1',
        payPeriodId: 'previous-period-1',
        userId: 'default-user',
        createdAt: '2024-11-16T00:00:00Z',
        updatedAt: '2024-11-16T00:00:00Z'
      },
      {
        id: 'te-p2', 
        date: '2024-11-17T00:00:00Z',
        startTime: '08:00',
        endTime: '12:00',
        calculatedHours: 4,
        costCenterId: 'cc-2',
        payPeriodId: 'previous-period-1',
        userId: 'default-user',
        createdAt: '2024-11-17T00:00:00Z',
        updatedAt: '2024-11-17T00:00:00Z'
      }
    ]
  }

  const entries = mockTimeEntries[payPeriodId] || []
  
  return {
    success: true,
    data: entries
  }
})