const { create } = require('xmlbuilder2');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const dynamicSitemapLink = require('./dynamicSitemapLink');
const generateMeditationPaths = require('./generateMediationPaths');
const routeConstants = require('../src/utils/constants/routes');
const generateTopicPaths = require('./generateTopicPaths');
const generateChannelPaths = require('./generateChannelPaths');
const generateCoachesPaths = require('./generateCoachesPaths');

const appDirectory = process.cwd();
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const SOURCE = path.join(resolveApp('src/pages'), '/**/!(_*).js');
// Set root element attribute
const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
  xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
});

async function createSitemap() {
  /**
   * STEP 1: Store all static pages url
   * */
  const diskPages = glob.sync(SOURCE);
  diskPages.forEach((page) => {
    const stats = fs.statSync(page);
    const modDate = new Date(stats.mtime);
    const lastMod = `${modDate.getFullYear()}-${`0${
      modDate.getMonth() + 1
    }`.slice(-2)}-${`0${modDate.getDate()}`.slice(-2)}`;

    // Strip the src/pages prefix to get the route-relative path,
    // e.g. `/coaches/index.js`, `/aura/index.js` or `/clear-cookies.js`.
    let indexedPage = page.replace(resolveApp('src/pages'), '');
    // Skip dynamic routes (`[slug]`) and Next.js API routes.
    if (indexedPage.indexOf('[') !== -1 || indexedPage.startsWith('/api/')) {
      return;
    }
    if (indexedPage.indexOf('index.js') !== -1) {
      // Directory index page: `/coaches/index.js` -> `/coaches`
      // (root `/index.js` collapses to '' and is skipped below).
      const indexSplit = indexedPage.split('/index.js');
      indexedPage = indexSplit[indexSplit.length - 2];
    } else {
      // Leaf page: `/clear-cookies.js` -> `/clear-cookies`
      indexedPage = indexedPage.replace(/\.js$/, '');
    }
    const pageName = indexedPage;
    if (pageName === '' || pageName === undefined) {
      return;
    }
    if (routeConstants.NO_INDEX_PAGES.includes(pageName)) {
      return;
    }
    indexedPage = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${pageName}`;

    const url = root.ele('url');
    url.ele({
      loc: indexedPage,
      priority: 0.9,
      changefreq: 'weekly',
      lastmod: lastMod,
    });
  });
  const xml = root.end({ prettyPrint: true });
  fs.writeFileSync('public/static/static-sitemap.xml', xml);
  fs.writeFileSync('public/static/sitemap.xml', xml);

  /**
   * Create dynamic links for coaches pages
   */
  const coachesPaths = await generateCoachesPaths();
  await dynamicSitemapLink({
    paths: coachesPaths,
    page: routeConstants.PAGE_COACHES,
    paramType: routeConstants.SLUG_COACH,
  });

  /**
   * Create dynamic links for meditation pages
   */
  const meditationPaths = await generateMeditationPaths();
  await dynamicSitemapLink({
    paths: meditationPaths,
    page: routeConstants.PAGE_TRACK,
    paramType: routeConstants.SLUG_MEDITATION,
  });

  /**
   * Create dynamic links for topics pages
   */
  const topicPaths = await generateTopicPaths();
  await dynamicSitemapLink({
    paths: topicPaths,
    page: routeConstants.PAGE_TOPICS,
    paramType: routeConstants.SLUG_CATEGORY,
  });

  /**
   * Create dynamic links for channels pages
   */
  const channelPaths = await generateChannelPaths();
  await dynamicSitemapLink({
    paths: channelPaths,
    page: routeConstants.PAGE_CHANNELS,
    paramType: routeConstants.SLUG_CHANNEL,
  });
}

createSitemap();
