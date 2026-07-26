// Regression test for the Express 4 -> 5 migration (PROD-3751). Express 5's
// path-to-regexp v8 exposes the '/session/{*path}' wildcard as an array of
// decoded path segments on req.params.path (Express 4 gave the whole remainder
// as a string on req.params[0]). handleSessionPath rebuilds the sub-path with
// .join('/'), guarding the missing-wildcard case (e.g. the bare '/session/'
// request, where req.params.path is undefined) so it still resolves to the
// domain root.
const handleSessionPath = require('./session');

describe('handleSessionPath — Express 5 wildcard path reconstruction', () => {
  const APP_DOMAIN = 'https://example.test';
  let originalDomain;
  let res;

  beforeEach(() => {
    originalDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;
    process.env.NEXT_PUBLIC_APP_DOMAIN = APP_DOMAIN;
    res = { cookie: jest.fn(), redirect: jest.fn() };
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_DOMAIN = originalDomain;
  });

  const call = (params) => handleSessionPath({ params, query: {} }, res);

  it('joins a multi-segment wildcard array back into the redirect path', () => {
    call({ path: ['a', 'b'] });
    expect(res.redirect).toHaveBeenCalledWith(`${APP_DOMAIN}/a/b`);
  });

  it('handles a single-segment wildcard array', () => {
    call({ path: ['foo'] });
    expect(res.redirect).toHaveBeenCalledWith(`${APP_DOMAIN}/foo`);
  });

  it('redirects to the domain root when the wildcard is absent (bare /session/)', () => {
    // Express 5 leaves req.params.path undefined for the empty match; the
    // `|| []` guard reproduces Express 4's req.params[0] === '' behavior.
    call({});
    expect(res.redirect).toHaveBeenCalledWith(`${APP_DOMAIN}/`);
  });

  it('sets the session cookie before redirecting when sessionCookie is present', () => {
    handleSessionPath(
      { params: { path: ['dashboard'] }, query: { sessionCookie: 'abc123' } },
      res
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'session_cookie',
      'abc123',
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.redirect).toHaveBeenCalledWith(`${APP_DOMAIN}/dashboard`);
  });
});
