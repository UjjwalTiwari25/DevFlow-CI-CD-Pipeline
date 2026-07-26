async function handleSessionPath(req, res) {
  // Extract the path after '/session/' from the full URL. Express 5 exposes
  // the named wildcard as an array of decoded path segments (req.params.path),
  // where Express 4 gave the whole remainder as a string on req.params[0].
  const fullPath = (req.params.path || []).join('/');
  const { sessionCookie, expiration } = req.query;
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/${fullPath}`;
  if (sessionCookie) {
    res.cookie('session_cookie', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiration
        ? parseInt(expiration, 10) - Date.now()
        : 2 * 60 * 60 * 1000, // 2 hours
    });
  }
  res.redirect(redirectTo);
}

module.exports = handleSessionPath;
