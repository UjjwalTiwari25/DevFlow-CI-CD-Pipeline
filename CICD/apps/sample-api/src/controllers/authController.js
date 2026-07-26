const authService = require('../services/authService');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, refresh };
