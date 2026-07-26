const Logger = require('../services/Logger');
const { isProdMode, isTestMode } = require('../utils');

const celebrities =
  isProdMode() || isTestMode()
    ? require('../data/celebrities.json')
    : require('../data/celebrities-dev.json');

function getCelebrityBySlug(slug) {
  Logger.debug(`Celebrity: get ${slug}`);
  if (slug) return celebrities[slug];
  return null;
}

function getCelebrityById(id) {
  Logger.debug(`Celebrity: get${id}`);
  const celebrity = Object.values(celebrities).find(
    (celebrityItem) => celebrityItem.userId === id
  );
  return celebrity;
}

function getAllCelebrities() {
  Logger.debug(`Get all celebrity`);
  return Object.values(celebrities);
}

function getIdBySlug(slug) {
  Logger.debug(`Celebrity: get ${slug}`);
  const celebrity = celebrities[slug];
  return celebrity ? celebrity.userId : null;
}

module.exports = {
  getCelebrityBySlug,
  getAllCelebrities,
  getCelebrityById,
  getIdBySlug,
};
