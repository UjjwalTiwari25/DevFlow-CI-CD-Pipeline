import Logger from '../services/Logger';

const contentTypes = require('../data/pageContent/contentTypePageRows.json');

async function listContentTypes() {
  Logger.debug('Content Types: list');
  return contentTypes;
}

function getContentTypeMinimalIcon(type) {
  return (
    contentTypes[type]?.minimalIcon || contentTypes?.meditation?.minimalIcon
  );
}

export { listContentTypes, getContentTypeMinimalIcon };
