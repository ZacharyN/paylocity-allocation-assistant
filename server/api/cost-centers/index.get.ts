import { PrismaClient } from '~/app/generated/prisma';

const prisma = new PrismaClient();

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
    
    const costCenters = await prisma.costCenter.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return costCenters;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch cost centers'
    });
  }
});