const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Authentication middleware.
 * Verifies the JWT token from the Authorization header.
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
}

module.exports = { authenticate };
