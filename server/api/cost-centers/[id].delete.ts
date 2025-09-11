import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cost center ID is required'
      });
    }
    
    await prisma.costCenter.delete({
      where: { id }
    });
    
    return { success: true, message: 'Cost center deleted successfully' };
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cost center not found'
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete cost center'
    });
  }
});