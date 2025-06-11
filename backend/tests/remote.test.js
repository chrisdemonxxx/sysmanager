const request = require('supertest');
const express = require('express');
const remoteRoute = require('../routes/remote.route');
const { sign } = require('../configs/auth.middleware');

const app = express();
app.use('/remote', remoteRoute);

const token = sign({ user: 'test' });

describe('DELETE /remote/processes/:pid', () => {
  it('returns 400 for invalid pid', async () => {
    const res = await request(app)
      .delete('/remote/processes/notnumber')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
