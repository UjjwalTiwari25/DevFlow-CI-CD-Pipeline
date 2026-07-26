/**
 * @module Logger
 * @description Service for the application logging
 *    Levels configured:
 *    { crit: 1, error: 2, warn: 3, info: 4, debug: 5}
 * @example Usage example (with metadata):
 *    Logger.warn(`user ${user} not authorized`, { ip: req.ip, user: req.jwt.user});
 * @copyright Aura Health, Inc.
 */
const axios = require('axios');
const config = require('../config');
const { isClient, isProdMode } = require('../utils');

const {
  logger: { level },
  service: { name: service, version },
} = config;

/**
 * Logger
 */
const levels = {
  debug: 5,
  info: 4,
  warn: 3,
  error: 2,
  crit: 1,
  audit: 0,
};
const stackdriver = {
  debug: 100,
  info: 200,
  warn: 400,
  error: 500,
  crit: 600,
  audit: 0,
};

class Logger {
  constructor() {
    this.isServerLogger = !isClient();
    this.baseMeta = {
      loggerId:
        globalThis.crypto?.randomUUID?.() ??
        `logger-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      serviceContext: {
        service,
        version,
      },
    };
    if (isProdMode() && isClient() && window.navigator) {
      const {
        appName,
        appCodeName,
        appVersion,
        platform,
        product,
        userAgent,
        vendor,
      } = window.navigator;
      this.baseMeta.browser = {
        appName,
        appCodeName,
        appVersion,
        platform,
        product,
        userAgent,
        vendor,
      };
    }
  }

  formatMeta(meta, logLevel) {
    const metaData = {
      ...this.baseMeta,
      ...meta,
      severity: stackdriver[logLevel],
    };
    if (isClient()) {
      metaData.url = window.location.href;
    }
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
    if (levels[logLevel] > levels[level]) return;

    const metaData = this.formatMeta(meta, logLevel);
    this.logToServer(message, metaData);

    // No logs on client in production
    if (isProdMode() && isClient()) return;
    // eslint-disable-next-line no-console
    const logger = console[logLevel] || console.error;
    if (this.isServerLogger) {
      logger(JSON.stringify({ message, ...metaData }));
    } else {
      logger(message, metaData);
    }
  }

  logToServer(message, meta) {
    try {
      if (isClient()) {
        // Fire-and-forget: axios() returns a promise, so a network failure or
        // the 11s timeout rejects asynchronously — the surrounding try/catch
        // only catches synchronous throws. Swallow the rejection so logging
        // never surfaces its own error as an unhandled rejection (Bugsnag noise).
        axios({
          method: `post`,
          url: `${config.appDomain}/api/log`,
          timeout: 11000,
          data: { message, ...meta },
        }).catch(() => {});
      }
    } catch (err) {
      // do nothing
    }
  }

  audit(message, meta = {}) {
    this.log(message, meta, 'audit');
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
    this.log(message, meta, 'info');
  }

  debug(message, meta = {}) {
    this.log(message, meta, 'debug');
  }

  startTime(label) {
    if (isClient()) return {};
    const hrstart = process.hrtime();
    return {
      hrstart,
      label,
    };
  }

  endTime({ hrstart, label }, meta = {}) {
    if (isClient()) return;
    const hrend = process.hrtime(hrstart);
    const time = Math.floor(hrend[0] * 1000 + hrend[1] / 1000000);
    if (time > 5000) {
      this.warn(`Execution time for ${label}: ${time} ms`, meta);
    } else {
      this.audit(`Execution time for ${label}: ${time} ms`, meta);
    }
  }

  startRequest(req) {
    if (!req) return {};
    if (req.path.startsWith('/_next/')) return {};
    if (req.path.startsWith('/static/')) return {};
    const startTime = this.startTime(req.path);
    this.audit(`Received request ${req.path}`, { headers: req.headers });
    return startTime;
  }

  endRequest(startTime, req) {
    if (!req) return;
    if (req.path.startsWith('/_next/')) return;
    if (req.path.startsWith('/static/')) return;
    this.audit(`Sent response ${req.path}`, {});
    this.endTime(startTime, {});
  }
}

module.exports = new Logger();
