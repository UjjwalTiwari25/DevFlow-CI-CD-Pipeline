const express = require('express');
const AuraCDN = require('../services/AuraCDN');
const Logger = require('../../src/services/Logger');

const router = express.Router();

// Get coaches list
router.get('/list', async (req, res) => {
  try {
    const { locale } = req.query;
    let fileName = 'coach';
    if (locale) {
      fileName = `${fileName}-${locale}`;
    }
    const coaches = await AuraCDN.fetchFirebaseData(fileName);
    if (!coaches) {
      Logger.warn(`No coaches data found for ${fileName}`);
      return res.status(404).json({ error: 'No coaches data found' });
    }
    return res.json(coaches);
  } catch (error) {
    Logger.error('Error fetching coaches list', { error });
    return res.status(500).json({ error: 'Failed to fetch coaches list' });
  }
});

module.exports = router;
