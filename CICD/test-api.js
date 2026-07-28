require('dotenv').config({ path: 'apps/sample-api/.env' });
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  const user = users[0];
  const token = jwt.sign({ id: user.id, email: user.email }, 'devflow-ai-jwt-secret-change-this-in-production-min-32-chars');
  
  console.log('Testing GET https://cicd-i4ud.onrender.com/api/dashboard/github/repos');
  const res = await fetch('https://cicd-i4ud.onrender.com/api/dashboard/github/repos', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (res.ok) {
    const data = await res.json();
    console.log('Success!', data.data.length, 'repos');
  } else {
    console.log('Failed:', res.status);
    console.log(await res.text());
  }
}
test();
