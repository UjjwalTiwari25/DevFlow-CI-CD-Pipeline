const fs = require('fs');

function writeFile(path, data, opts = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = writeFile;
