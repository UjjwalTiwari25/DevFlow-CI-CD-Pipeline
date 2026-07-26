const { convert } = require('xmlbuilder2');
const fs = require('fs');
const { isProdMode } = require('../src/utils');

function dynamicSitemapLink({ paths, page, paramType, options = {} }) {
  if (!isProdMode()) {
    return;
  }
  const fileData = fs.readFileSync('public/static/sitemap.xml', {
    encoding: 'utf8',
    flag: 'r',
  });
  const obj = convert({ encoding: 'UTF-8' }, fileData, { format: 'object' });

  const modDate = new Date();
  const lastMod = `${modDate.getFullYear()}-${`0${
    modDate.getMonth() + 1
  }`.slice(-2)}-${`0${modDate.getDate()}`.slice(-2)}`;

  paths.forEach((slug) => {
    obj.urlset.url.push({
      loc: page
        ? `${process.env.NEXT_PUBLIC_APP_DOMAIN}/${page}/${slug.params[paramType]}`
        : `${process.env.NEXT_PUBLIC_APP_DOMAIN}/${slug.params[paramType]}`,
      priority: `${options.priority || 0.5}`,
      changefreq: `${options.changefreq || 'weekly'}`,
      lastmod: `${lastMod}`,
    });
  });
  const xml = convert({ ...obj }, { prettyPrint: true });
  fs.writeFileSync('public/static/sitemap.xml', xml);
}

module.exports = dynamicSitemapLink;
