import { PrismaClient } from 'F:/PyCharm-Projects/cost-center-allocator/app/generated/prisma';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient | undefined;
}