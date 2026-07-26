/* eslint-disable no-param-reassign */

const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require('webpack-bugsnag-plugins');
const { isProdMode } = require('./src/utils');
const projectConfig = require('./src/config');
const { i18n } = require('./next-i18next.config');

const bugsnagOptions = projectConfig.bugsnag;
module.exports = {
  productionBrowserSourceMaps: true,
  transpilePackages: ['@aurahealth/web-design-system'],
  experimental: {
    // Increase threshold to suppress warning for pages with large data payloads
    // Default is 128 KB, setting to 356 KB to accommodate larger channel pages
    largePageDataBytes: 356 * 1024, // 356 KB
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on Node built-ins on the client.
    // next-i18next v16's serverSideTranslations pulls in `fs`, `path`, and
    // `module`; it only runs in getServerSideProps/getStaticProps, so stub these
    // out of the client bundle.
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.path = false;
      config.resolve.fallback.module = false;
    }
    if (isProdMode()) {
      config.plugins.push(new BugsnagBuildReporterPlugin(bugsnagOptions));
      config.plugins.push(
        new BugsnagSourceMapUploaderPlugin({
          apiKey: bugsnagOptions.apiKey,
          appVersion: bugsnagOptions.appVersion,
          releaseStage: bugsnagOptions.releaseStage,
          publicPath: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/_next/`,
          overwrite: true,
          uploadSource: true,
        })
      );
    }

    /**
     * Webpack configuration to import svg as React components
     * @see https://react-svgr.com/docs/next/
     */
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false, // Do not set width and height on the svg - otherwise cannot override with css
              replaceAttrValues: {
                // Replace hardcoded color in svg to use currentColor to allow dynamic colors
                '#9092A3': 'currentColor',
                '#2F3237': 'currentColor',
              },
            },
          },
        ],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  images: {
    remotePatterns: [
      'photos.cdn.aurahealth.io',
      'coaches.cdn.aurahealth.io',
      'channels.cdn.aurahealth.io',
      'flags.cdn.aurahealth.io',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'd3t3ozftmdmh3i.cloudfront.net',
      'images.unsplash.com',
      'unsplash.it',
      'lh3.googleusercontent.com',
      'pic.com',
    ].map((hostname) => ({ protocol: 'https', hostname })),
  },
  i18n,
};
