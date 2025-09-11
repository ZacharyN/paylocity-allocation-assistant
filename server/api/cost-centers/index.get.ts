// import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId as string;
    
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }
    
    // Mock data for testing
    const costCenters = [
      {
        id: '1',
        division: 123,
        funding: 456,
        program: 789,
        percentage: 60,
        userId
      },
      {
        id: '2', 
        division: 123,
        funding: 456,
        program: 790,
        percentage: 30,
        userId
      }
    ];
    
    return costCenters;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch cost centers'
    });
  }
});