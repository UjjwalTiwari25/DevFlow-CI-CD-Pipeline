const request = require('supertest');
const app = require('../../src/app');

describe('Health Check Endpoint', () => {
  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('devflow-sample-api');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
      expect(res.body.memory).toBeDefined();
      expect(res.body.memory.used).toBeDefined();
      expect(res.body.memory.total).toBeDefined();
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/not found/i);
  });
});
