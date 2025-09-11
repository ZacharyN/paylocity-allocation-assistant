import { PrismaClient } from '~/app/generated/prisma';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cost center ID is required'
      });
    }
    
    const { division, funding, program, percentage } = body;
    
    if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Percentage must be between 0 and 100'
      });
    }
    
    const costCenter = await prisma.costCenter.update({
      where: { id },
      data: {
        division,
        funding,
        program,
        percentage
      }
    });
    
    return costCenter;
  } catch (error) {
    if (error.statusCode) throw error;
    
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cost center not found'
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update cost center'
    });
  }
});