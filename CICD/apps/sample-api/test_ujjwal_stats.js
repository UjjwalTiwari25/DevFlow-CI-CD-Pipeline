const { getStats } = require('./src/services/dashboardService.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const stats = await getStats('b35f329d-6c60-408f-af5b-87d033aa401b');
  console.log(stats);
}
main().finally(() => prisma.$disconnect());
