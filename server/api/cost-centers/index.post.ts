import { PrismaClient } from '~/app/generated/prisma';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const { division, funding, program, percentage, userId } = body;
    
    if (!division || !funding || !program || percentage === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: division, funding, program, and percentage are required'
      });
    }
    
    if (percentage < 0 || percentage > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Percentage must be between 0 and 100'
      });
    }
    
    const costCenter = await prisma.costCenter.create({
      data: {
        division,
        funding,
        program,
        percentage,
        userId
      }
    });
    
    return costCenter;
  } catch (error) {
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create cost center'
    });
  }
});