const BaseX = require('../services/BaseX');
const Logger = require('../services/Logger');

function stripSpecialCharactersForURL(str) {
  return str.replace(/[^a-zA-Z0-9-_$]+/g, '-').toLowerCase();
}

function generateURLPathWithID(initials, id) {
  return initials
    ? `${initials.replace(/[^a-zA-Z0-9-_$]+/g, '-').toLowerCase()}-${BaseX.to36(
        id
      )}`
    : BaseX.to36(id);
}

function getIDFromURL(query) {
  try {
    const validRegex = /^[0-9a-zA-Z\\_\\-]+$/;
    let id = query;
    if (query.includes('-')) {
      id = query.split('-');
      id = id[id.length - 1];
    }
    const formattedId = BaseX.from36(id);
    if (formattedId.match(validRegex)) {
      return formattedId;
    }
  } catch (error) {
    Logger.debug(`Error parsing Id: ${error}`, { error, query });
  }
  return query;
}

const urlFormater = {
  stripSpecialCharactersForURL,
  generateURLPathWithID,
  getIDFromURL,
};

module.exports = urlFormater;
