const express = require('express');
const { handleGithubPush } = require('../controllers/webhookController');
const { verifyGithubWebhook } = require('../middlewares/webhookAuth');

const router = express.Router();

// GitHub webhook endpoint — HMAC signature verification runs first
router.post('/github', verifyGithubWebhook, handleGithubPush);

module.exports = router;
