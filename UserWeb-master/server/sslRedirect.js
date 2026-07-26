const enforceSSL = require('express-sslify');
const appConstants = require('../src/utils/constants/app');
const config = require('../src/config');

const dev =
  config.environment !== 'production' || config.mode === appConstants.MODE_TEST;
const enforceHTTPS = enforceSSL.HTTPS({ trustProtoHeader: true });

function sslRedirect(req, res, next) {
  if (dev) {
    next();
  } else {
    enforceHTTPS(req, res, next);
  }
}

module.exports = sslRedirect;
