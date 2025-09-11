import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id') as string;
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pay period ID is required'
      });
    }

    // Check if pay period has associated time entries
    const timeEntriesCount = await prisma.timeEntry.count({
      where: { payPeriodId: id }
    });

    if (timeEntriesCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete pay period with existing time entries'
      });
    }
    
    await prisma.payPeriod.delete({
      where: { id }
    });
    
    return { success: true, message: 'Pay period deleted successfully' };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pay period not found'
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete pay period'
    });
  }
});