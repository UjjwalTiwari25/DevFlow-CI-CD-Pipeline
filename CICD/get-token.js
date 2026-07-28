require('dotenv').config({ path: 'apps/sample-api/.env' });
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
  const user = users[0];
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'devflow-ai-jwt-secret-change-this-in-production-min-32-chars');
  console.log("USER_OBJECT:", JSON.stringify(user));
  console.log("JWT_TOKEN:", token);
}
run();
