export default defineEventHandler(async (event) => {
  // Mock cost centers data
  const mockCostCenters = [
    {
      id: "cc-1",
      division: 123,
      funding: 456,
      program: 789,
      percentage: 60,
      userId: "default-user"
    },
    {
      id: "cc-2", 
      division: 123,
      funding: 456,
      program: 790,
      percentage: 25,
      userId: "default-user"
    },
    {
      id: "cc-3",
      division: 124,
      funding: 457,
      program: 791,
      percentage: 15,
      userId: "default-user"
    }
  ]

  return {
    success: true,
    data: mockCostCenters
  }
})
