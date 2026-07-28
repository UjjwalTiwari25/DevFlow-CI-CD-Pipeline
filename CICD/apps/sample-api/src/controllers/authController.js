const authService = require('../services/authService');
const { config } = require('../config');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth/refresh',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

async function githubLogin(req, res) {
  const clientId = config.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || "Ov23liJagrJuYVuH85kI"; // fallback to known local client id
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user:email`;
  res.redirect(redirectUri);
}

async function githubCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.FRONTEND_URL}/login?error=MissingCode`);
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID,
        client_secret: config.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      return res.redirect(`${config.FRONTEND_URL}/login?error=TokenExchangeFailed`);
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'DevFlow-AI-App'
      },
    });
    
    const userData = await userRes.json();

    const result = await authService.handleGithubCallback(userData, accessToken);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    const userStr = encodeURIComponent(JSON.stringify(result.user));
    res.redirect(`${config.FRONTEND_URL}/login?token=${result.accessToken}&refreshToken=${result.refreshToken}&user=${userStr}`);
  } catch (error) {
    console.error('GitHub Auth Error:', error.message);
    res.redirect(`${config.FRONTEND_URL}/login?error=OAuthFailed`);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

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

async function logout(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth/refresh',
  });
  res.json({ status: 'success', message: 'Logged out' });
}

module.exports = { githubLogin, githubCallback, refresh, logout };
