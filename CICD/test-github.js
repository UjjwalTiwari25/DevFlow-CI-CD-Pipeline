require('dotenv').config({ path: 'apps/sample-api/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    if (!users.length) {
      console.log('No users found.');
      return;
    }

    const user = users[0];
    console.log(`Testing token for user: ${user.email}, githubId: ${user.githubId}`);
    console.log(`Token: ${user.githubAccessToken ? user.githubAccessToken.substring(0, 10) + '...' : 'NONE'}`);

    const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'DevFlow-AI-App',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Success! Found ${data.length} repos.`);
    } else {
      console.log(`GitHub API failed: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log('Error details:', text);
    }
  } catch (e) {
    console.error('Script error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
