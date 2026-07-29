const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  const repos = await prisma.repository.findMany();
  console.log('USERS:', users.map(u => ({ id: u.id, name: u.name })));
  console.log('REPOS:', repos.map(r => ({ id: r.id, ownerId: r.ownerId, name: r.name })));
}
main().finally(() => prisma.$disconnect());
