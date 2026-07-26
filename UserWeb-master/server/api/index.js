const express = require('express');
const requestIp = require('request-ip');
const { getCelebrityBySlug } = require('../../src/models/celebrities');
const config = require('../config');
const coachRouter = require('./coach');

const ApiRouter = express.Router();
const { appDomain: APP_DOMAIN } = config();

ApiRouter.use(express.json());

ApiRouter.use('/coaches', coachRouter);

ApiRouter.post('/log', async (req, res) => {
  console.log(JSON.stringify(req.body));
  return res.status(200).send();
});

ApiRouter.get('/celebrityInvite/:celebritySlug', async (req, res) => {
  const { celebritySlug } = req.params;
  const celebrity = getCelebrityBySlug(celebritySlug);
  let url = `${APP_DOMAIN}/signup`;
  if (celebrity) {
    const urlQuery = new URLSearchParams({
      ...req.query,
      celeb_id: celebrity.userId,
    });
    url += `?${urlQuery.toString()}`;
  }
  return res.redirect(url);
});

ApiRouter.get('/celebrityLP/:celebritySlug', async (req, res) => {
  const { celebritySlug } = req.params;
  const celebrity = getCelebrityBySlug(celebritySlug);
  let url = `${APP_DOMAIN}/celebrities/${celebritySlug}`;
  if (celebrity) {
    const urlQuery = new URLSearchParams({
      utm_source: 'celebrity',
      ...req.query,
      celeb_id: celebrity.userId,
    });
    url += `?${urlQuery.toString()}`;
  }
  return res.redirect(url);
});

ApiRouter.get('/ip', async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  return res.status(200).json({ ip: clientIp });
});

module.exports = ApiRouter;
