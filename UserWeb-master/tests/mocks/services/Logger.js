/**
 * @module Logger
 * @description Service for the application logging
 *    Levels configured:
 *    { crit: 1, error: 2, warn: 3, info: 4, debug: 5}
 * @example Usage example (with metadata):
 *    Logger.warn(`user ${user} not authorized`, { ip: req.ip, user: req.jwt.user});
 * @copyright Aura Health, Inc.
 */
/**
 * Logger
 */
const stackdriver = {
  debug: 100,
  info: 200,
  warn: 400,
  error: 500,
  crit: 600,
};

class Logger {
  constructor() {
    this.baseMeta = {
      loggerId: globalThis.crypto.randomUUID(),
      testingLogger: true,
    };
    this.isDebugMode = false;
  }

  formatMeta(meta, logLevel) {
    const metaData = {
      ...this.baseMeta,
      ...meta,
      severity: stackdriver[logLevel],
    };
    metaData.timestamp = new Date().toISOString();
    return metaData;
  }

  addUserData(userData) {
    if (!userData) return;
    const { id, role, email, givenName } = userData;
    const { user = {} } = this.baseMeta;
    user.id = id;
    user.role = role;
    user.email = email;
    user.givenName = givenName;
    this.baseMeta.user = user;
  }

  log(message, meta, logLevel) {
    const metaData = this.formatMeta(meta, logLevel);
    const logger = console[logLevel] || console.error;
    logger(message, metaData);
  }

  crit(message = '', meta = {}) {
    const logMessage = message.stack || message;
    this.log(logMessage, meta, 'crit');
  }

  error(message = '', meta = {}) {
    const logMessage = message.stack || message;
    this.log(logMessage, meta, 'error');
  }

  warn(message, meta = {}) {
    this.log(message, meta, 'warn');
  }

  info(message, meta = {}) {
    if (this.isDebugMode) {
      this.log(message, meta, 'info');
    }
  }

  debug(message, meta = {}) {
    if (this.isDebugMode) {
      this.log(message, meta, 'debug');
    }
  }
}

module.exports = new Logger();
