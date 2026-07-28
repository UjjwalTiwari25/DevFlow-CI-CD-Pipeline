const { Router } = require('express');
const { authenticate } = require('../middlewares/auth');
const { enforceUsageLimits } = require('../middlewares/usage');
const ds = require('../services/dashboardService');

const router = Router();
router.use(authenticate);

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const { emitter } = require('../utils/pubsub');

router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  const listener = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on(`user:${req.user.id}`, listener);
  emitter.on('global', listener);

  req.on('close', () => {
    emitter.off(`user:${req.user.id}`, listener);
    emitter.off('global', listener);
  });
});

router.get(
  '/stats',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getStats(req.user.id) });
  })
);

router.get(
  '/repositories',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getRepositories(req.user.id) });
  })
);

router.get(
  '/github/repos',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getGithubRepositories(req.user.id) });
  })
);
router.post(
  '/repositories',
  enforceUsageLimits,
  wrap(async (req, res) => {
    const repo = await ds.createRepository(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: repo });
  })
);
router.delete(
  '/repositories/:id',
  wrap(async (req, res) => {
    await ds.deleteRepository(req.params.id, req.user.id);
    res.json({ status: 'success', message: 'Repository deleted' });
  })
);
router.post(
  '/repositories/:id/trigger',
  wrap(async (req, res) => {
    const run = await ds.triggerPipeline(req.params.id, req.user.id);
    res.status(201).json({ status: 'success', data: run });
  })
);

router.get(
  '/pipelines',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getPipelines(req.user.id, req.query) });
  })
);
router.get(
  '/pipelines/:id',
  wrap(async (req, res) => {
    const pipeline = await ds.getPipelineById(req.params.id);
    if (!pipeline) return res.status(404).json({ status: 'error', message: 'Pipeline not found' });
    res.json({ status: 'success', data: pipeline });
  })
);
router.get(
  '/pipelines/:id/logs',
  wrap(async (req, res) => {
    const logs = await ds.getPipelineLogs(req.params.id);
    res.json({ status: 'success', data: logs });
  })
);
router.post(
  '/pipelines/:id/rerun',
  wrap(async (req, res) => {
    res.status(201).json({ status: 'success', data: await ds.rerunPipeline(req.params.id) });
  })
);

router.get(
  '/deployments',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getDeployments(req.user.id, req.query) });
  })
);
router.post(
  '/deployments/trigger/:repoId',
  wrap(async (req, res) => {
    res
      .status(201)
      .json({ status: 'success', data: await ds.triggerDeployment(req.params.repoId) });
  })
);
router.post(
  '/deployments/:id/rollback',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.rollbackDeployment(req.params.id) });
  })
);

router.get(
  '/security',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getSecurityScans(req.user.id, req.query) });
  })
);

router.get(
  '/health',
  wrap(async (req, res) => {
    res.json({ status: 'success', data: await ds.getHealthStatus() });
  })
);

module.exports = router;
