const bcrypt = require('bcryptjs');
const { prisma } = require('../models/prisma');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError } = require('../utils/errors');
const { config } = require('../config');

/**
 * Register a new user.
 * @param {object} data - { email, password, name }
 * @returns {object} { user, accessToken, refreshToken }
 */
async function register({ email, password, name }) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Create user and start free trial
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      subscription: {
        create: {
          plan: 'FREE',
          status: 'TRIAL',
          trialEndsAt: thirtyDaysFromNow
        }
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
}

/**
 * Login an existing user.
 * @param {object} data - { email, password }
 * @returns {object} { user, accessToken, refreshToken }
 */
async function login({ email, password }) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh an access token.
 * @param {string} refreshToken - The refresh token
 * @returns {object} { accessToken }
 */
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
  register,
  login,
  refreshAccessToken,
};
