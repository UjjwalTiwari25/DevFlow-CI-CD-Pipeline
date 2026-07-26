const express = require('express');
const { handleGithubPush } = require('../controllers/webhookController');

const router = express.Router();

// Public webhook endpoint for GitHub to hit
router.post('/github', handleGithubPush);

module.exports = router;
