const { getStats } = require('./src/services/dashboardService.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (user) {
    const stats = await getStats(user.id);
    console.log(stats);
  }
}
main().finally(() => prisma.$disconnect());
