const jwt = require('jsonwebtoken');
const { config } = require('../config');

/**
 * Generate an access token for a user.
 * @param {object} payload - User data to encode (id, email)
 * @returns {string} Signed JWT access token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

/**
 * Generate a refresh token for a user.
 * @param {object} payload - User data to encode (id)
 * @returns {string} Signed JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
