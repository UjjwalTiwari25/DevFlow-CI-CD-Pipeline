/* eslint-disable global-require */
const { loadEnvConfig } = require('@next/env');

loadEnvConfig('./', process.env.NODE_ENV !== 'production');
const fs = require('fs');
const path = require('path');
const next = require('next');
const { match } = require('node-match-path');
const express = require('express');
const os = require('os');
const Logger = require('../src/services/Logger');
const config = require('../src/config');
const sslRedirect = require('./sslRedirect');
const pageRedirects = require('./redirects');
const affiliateRedirects = require('./redirects/affiliates.json');
const { isProdMode } = require('../src/utils/index');
const handleDeeplinkPath = require('./deeplink');
const handleSessionPath = require('./session');
// set the global bootsrap time and ready status
global.APP_START_TIMESTAMP = Date.now();
global.APP_READY_STATUS = false;

const dev = config.environment === 'development';
// Next.js 16 defaults to Turbopack. This app relies on a custom webpack config
// (SVGR + Bugsnag source-map upload in next.config.js), so force webpack to keep
// that pipeline working. Production builds do the same via `next build --webpack`.
const app = next({ dev, webpack: true });
const handle = app.getRequestHandler();
const port = process.env.PORT || process.env.HTTP_PORT || 3000;

// Paths that will have a web user auth token automatically added. Do not add endpoints here that are user specific (appointment booking, payment etc)
const PROTECTED_ROUTES = [
  '/coaching/coachPackages/list',
  '/emails/unsubscribe',
  '/experiments/list',
  '/lists/recommend',
  '/scheduling/appointments/',
  '/scheduling/appointments/onSched/:onSchedAppointmentId',
  '/scheduling/appointments/onSched/:onSchedId/confirmAttendee',
  '/scheduling/availability/list',
  '/scheduling/coaches/:coachId',
  '/scheduling/reviews/list',
  '/scheduling/services/:id',
  '/scheduling/services/list',
  '/scheduling/live/:eventId',
  '/scheduling/live/list',
  '/series/:id',
  '/series/list',
  '/contents/recommend',
  '/users/email/:emailId',
  '/courses/:courseId',
  '/communities/:communityId',
  '/communities/coaches/list',
  '/events/:eventId',
  '/events/coaches/list',
  '/events/users/list',
  '/events/list',
  '/courses/list',
  '/courses/coaches/list',
];

const proxyConfig = {
  '/auraServices': {
    target: process.env.NEXT_PUBLIC_AURA_SERVICES_URL,
    changeOrigin: true,
    pathRewrite: { '^/auraServices': '' },
    // http-proxy-middleware v3+ moved event handlers under the `on` option.
    on: { proxyReq: onProxyReq },
  },
};

function onProxyReq(proxyReq, req) {
  // add custom header to request
  const { authorization } = req.headers;
  const isProtectedUrl = PROTECTED_ROUTES.find(
    (route) => match(route, req.url).matches
  );
  if (
    isProtectedUrl &&
    (!authorization ||
      (authorization && !authorization.startsWith('Bearer')) ||
      !authorization.split(' ')[1] ||
      authorization.split(' ')[1] === 'null' ||
      authorization.split(' ')[1] === 'undefined')
  ) {
    proxyReq.setHeader(
      'Authorization',
      `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`
    );
  }
}

app
  .prepare()
  .then(async () => {
    // All services, routes that depend on env variable should be required after server start, since NextJs loads the env variables when server is started and are not available before.
    const ApiRouter = require('./api');

    // http-proxy-middleware v4 is ESM-only, so load it via dynamic import
    // from this CommonJS module.
    const { createProxyMiddleware } = await import('http-proxy-middleware');

    // Initialize cache service
    const cacheService = require('./services/Cache');
    cacheService.initialize();
    Logger.info('Cache service initialized');

    const server = express();

    Object.keys(proxyConfig).forEach((proxyPath) => {
      Logger.info('Setting up proxy', proxyConfig[proxyPath]);
      server.use(proxyPath, createProxyMiddleware(proxyConfig[proxyPath]));
    });
    server.get('/ready', (req, res) => {
      const status = global.APP_READY_STATUS === true ? 200 : 503;
      res.sendStatus(status);
    });
    server.get('/status', (req, res) => {
      const uptime = Date.now() - global.APP_START_TIMESTAMP;
      const hostname = os.hostname();
      res.json({
        status: 'UP',
        started: global.APP_START_TIMESTAMP,
        uptime,
        hostname,
      });
    });
    server.use(sslRedirect);
    server.use('/api', ApiRouter);

    // https://www.aurahealth.io/deeplink/destination/challengeDetails/objectId/serenity_through_mindfulness_2
    server.get(
      '/deeplink/destination/:destination/objectId/:objectId',
      handleDeeplinkPath
    );

    server.get('/session/{*path}', handleSessionPath);

    // Apple App Site Association - this is required for deeplinking on mobile app
    server.get('/.well-known/apple-app-site-association', function (req, res) {
      const filePath = path.resolve(
        '.',
        'public/static/apple-app-site-association.json'
      );
      const fileBuffer = fs.readFileSync(filePath);
      res.set('Content-Type', 'application/json');
      res.status(200).send(fileBuffer);
    });

    // Android app links
    server.get('/.well-known/assetlinks.json', function (req, res) {
      const filePath = path.resolve('.', 'public/static/assetlinks.json');
      const fileBuffer = fs.readFileSync(filePath);
      res.set('Content-Type', 'application/json');
      res.status(200).send(fileBuffer);
    });

    server.get(
      '/.well-known/apple-developer-merchantid-domain-association',
      function (req, res) {
        const filePath = path.resolve(
          '.',
          'public/static/apple-developer-merchantid-domain-association'
        );
        const fileBuffer = fs.readFileSync(filePath);
        res.set('Content-Type', 'text/plain');
        res.status(200).send(fileBuffer);
      }
    );
    server.get('/robots.txt', (req, res) => {
      const filePath = path.resolve('.', 'public/static/robots.txt');
      const fileBuffer = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'text/javascript');
      res.send(fileBuffer);
    });

    server.get('/aff/:slug', (req, res) => {
      const { slug } = req.params;
      const query = req.url.split('?')[1];
      const redirect = affiliateRedirects[slug];
      if (!redirect) {
        return res.status(404).send('Page Not Found');
      }
      const { path: affiliatePath, query: affiliateQuery } = redirect;
      const queryString = query ? `${query}&${affiliateQuery}` : affiliateQuery;
      return res.redirect(
        301,
        `${process.env.NEXT_PUBLIC_APP_DOMAIN}${affiliatePath}?${queryString}`
      );
    });

    if (isProdMode()) {
      server.get('/sitemap.xml', (req, res) => {
        const filePath = path.resolve('.', 'public/static/sitemap.xml');
        const fileBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'text/xml;charset=UTF-8');
        res.send(fileBuffer);
      });

      server.get('/staticSitemap.xml', (req, res) => {
        const filePath = path.resolve('.', 'public/static/static-sitemap.xml');
        const fileBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'text/xml;charset=UTF-8');
        res.send(fileBuffer);
      });
    }

    server.get('/aurie/desktop', async (req, res) => {
      const axios = require('axios');

      const yamlUrl = process.env.NEXT_PUBLIC_DESKTOP_YAML_URL;
      const releasesBaseUrl = process.env.NEXT_PUBLIC_DESKTOP_RELEASES_BASE_URL;

      if (!yamlUrl) {
        res.status(503).json({
          error: 'Desktop download service is temporarily unavailable',
          details: 'Version configuration is missing. Please contact support.',
        });
        return;
      }

      if (!releasesBaseUrl) {
        res.status(503).json({
          error: 'Desktop download service is temporarily unavailable',
          details:
            'Download location is not configured. Please contact support.',
        });
        return;
      }

      let yamlResponse;
      try {
        yamlResponse = await axios.get(yamlUrl);
      } catch (error) {
        console.error('Error in desktop download:', error?.message);
        res.status(502).json({
          error: 'Unable to check latest version',
          details:
            error.response?.status === 404
              ? 'Version information not found. Please try again later.'
              : 'Could not connect to version server. Please try again.',
        });
        return;
      }

      const yamlText = yamlResponse.data;
      if (!yamlText || typeof yamlText !== 'string') {
        res.status(502).json({
          error: 'Unable to read version information',
          details: 'Version data is unavailable. Please try again later.',
        });
        return;
      }

      const versionMatch = yamlText.match(/version:\s*"([^"]+)"/);
      if (!versionMatch || !versionMatch[1]) {
        res.status(502).json({
          error: 'Unable to determine latest version',
          details: 'Version information is missing. Please try again later.',
        });
        return;
      }

      const latestVersion = versionMatch[1];
      const latestFile = `Aurie-${latestVersion}-arm64.dmg`;
      const downloadUrl = `${releasesBaseUrl}${latestVersion}/${latestFile}`;

      let dmgResponse;
      try {
        dmgResponse = await axios({
          method: 'GET',
          url: downloadUrl,
          responseType: 'stream',
          timeout: 300000,
        });
      } catch (error) {
        console.error('Error in desktop download:', error?.message);
        if (error.response?.status === 404) {
          res.status(404).json({
            error: 'Download not available',
            details:
              'This version is not available yet. Please try again later.',
          });
          return;
        }

        res.status(502).json({
          error: 'Download failed',
          details: 'Could not connect to download server. Please try again.',
        });
        return;
      }

      try {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${latestFile}"`
        );
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');

        if (dmgResponse.headers['content-length']) {
          res.setHeader(
            'Content-Length',
            dmgResponse.headers['content-length']
          );
        }
      } catch (error) {
        console.error('Error in desktop download:', error?.message);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Download preparation failed',
            details: 'Unable to start download. Please try again.',
          });
        }
        return;
      }

      dmgResponse.data.pipe(res);

      dmgResponse.data.on('error', (error) => {
        console.error('Error in desktop download:', error?.message);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Download interrupted',
            details: 'Connection was lost during download. Please try again.',
          });
        }
      });

      res.on('close', () => {
        if (!res.writableEnded) {
          dmgResponse.data.destroy();
        }
      });
    });

    // The dedicated similar-tracks SSR page (removed earlier) and the inline
    // "Similar tracks" row on the track page were both taken out to relieve the
    // server OOM/timeout crash-loop: the SSR page for its heavy getServerSideProps
    // working set, the inline row because its /related fetch round-tripped through
    // this Node process via the same-origin /auraServices proxy on every track view.
    // Redirect old URLs to the track page, the canonical content the removed page
    // pointed to.
    server.get('/track/:slugMeditation/similar-tracks', (req, res) => {
      const { slugMeditation } = req.params;
      return res.redirect(
        301,
        `${process.env.NEXT_PUBLIC_APP_DOMAIN}/track/${encodeURIComponent(
          slugMeditation
        )}`
      );
    });

    server.get('/{*path}', sslRedirect, async (req, res) => {
      const startTime = Logger.startRequest(req);
      if (pageRedirects[req.path]) {
        res.setHeader('X-Robots-Tag', 'none');
        const query = req.url.split('?')[1];
        const queryString = query ? `?${query}` : '';
        return res.redirect(
          301,
          `${process.env.NEXT_PUBLIC_APP_DOMAIN}${
            pageRedirects[req.path]
          }${queryString}`
        );
      }
      const result = await handle(req, res);
      Logger.endRequest(startTime, req);
      return result;
    });
    server.listen(port, (err) => {
      if (err) throw err;
      global.APP_READY_STATUS = true;
      Logger.info(`listening on port ${port}`);
    });
  })
  .catch((ex) => {
    Logger.error({ ex });
    process.exit(1);
  });
