import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id') as string;
    const body = await readBody(event);
    const { startDate, endDate, totalHours } = body;
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pay period ID is required'
      });
    }

    // Build update data object
    const updateData: any = {};
    
    if (startDate) {
      updateData.startDate = new Date(startDate);
    }
    
    if (endDate) {
      updateData.endDate = new Date(endDate);
    }
    
    if (totalHours !== undefined) {
      if (totalHours <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Total hours must be positive'
        });
      }
      updateData.totalHours = parseFloat(totalHours);
    }

    // Validate dates if both are provided
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw createError({
          statusCode: 400,
          statusMessage: 'End date must be after start date'
        });
      }
    }

    // If only one date is provided, check against existing data
    if (updateData.startDate || updateData.endDate) {
      const existingPeriod = await prisma.payPeriod.findUnique({
        where: { id }
      });
      
      if (!existingPeriod) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Pay period not found'
        });
      }

      const finalStartDate = updateData.startDate || existingPeriod.startDate;
      const finalEndDate = updateData.endDate || existingPeriod.endDate;
      
      if (finalStartDate >= finalEndDate) {
        throw createError({
          statusCode: 400,
          statusMessage: 'End date must be after start date'
        });
      }
    }
    
    const payPeriod = await prisma.payPeriod.update({
      where: { id },
      data: updateData
    });
    
    return payPeriod;
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
      statusMessage: 'Failed to update pay period'
    });
  }
});