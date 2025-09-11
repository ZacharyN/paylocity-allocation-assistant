import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { startDate, endDate, totalHours, userId } = body;
    
    // Validation
    if (!startDate || !endDate || !totalHours || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required: startDate, endDate, totalHours, userId'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start >= end) {
      throw createError({
        statusCode: 400,
        statusMessage: 'End date must be after start date'
      });
    }

    // Validate total hours
    if (totalHours <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Total hours must be positive'
      });
    }

    // Check for overlapping pay periods
    const overlappingPeriod = await prisma.payPeriod.findFirst({
      where: {
        userId,
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } }
            ]
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } }
            ]
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      }
    });

    if (overlappingPeriod) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pay period overlaps with existing period'
      });
    }
    
    const payPeriod = await prisma.payPeriod.create({
      data: {
        startDate: start,
        endDate: end,
        totalHours: parseFloat(totalHours),
        userId
      }
    });
    
    return payPeriod;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create pay period'
    });
  }
});