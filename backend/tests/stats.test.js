const request = require('supertest');
const express = require('express');
const statsRoute = require('../routes/stats.route');
const { sign } = require('../configs/auth.middleware');

const app = express();
app.use('/stats', statsRoute);

const token = sign({ user: 'test' });

describe('GET /stats', () => {
  it('responds with stats data', async () => {
    const res = await request(app)
      .get('/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('cpu');
    expect(res.body.data).toHaveProperty('disk');
  });
});
