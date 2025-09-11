import prisma from '../../utils/prisma';

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
    
    const payPeriods = await prisma.payPeriod.findMany({
      where: {
        userId
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    
    return payPeriods;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch pay periods'
    });
  }
});