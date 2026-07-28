const { prisma } = require('../models/prisma');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');

async function handleGithubCallback(githubUser, githubToken) {
  const { id: githubId, login: githubUsername, email, name, avatar_url } = githubUser;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const userEmail = email || `${githubUsername}@users.noreply.github.com`;

  const user = await prisma.user.upsert({
    where: { githubId },
    update: {
      githubUsername,
      name: name || githubUsername,
      email: userEmail,
      avatarUrl: avatar_url,
      githubAccessToken: githubToken,
    },
    create: {
      githubId,
      githubUsername,
      name: name || githubUsername,
      email: userEmail,
      avatarUrl: avatar_url,
      githubAccessToken: githubToken,
      subscription: {
        create: {
          plan: 'FREE',
          status: 'TRIAL',
          trialEndsAt: thirtyDaysFromNow,
        },
      },
    },
  });

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      githubUsername: user.githubUsername,
    },
    accessToken,
    refreshToken,
  };
}

async function refreshAccessToken(refreshToken) {
  const decoded = verifyToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });

  return { accessToken };
}

module.exports = {
  handleGithubCallback,
  refreshAccessToken,
};
