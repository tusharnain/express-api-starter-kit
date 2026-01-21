import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { server } from '@/http/index';

const app = server.app;

describe('Web Routes', () => {
  it('GET / should return status true', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: true });
  });

  it('GET /non-existent-route should return 404', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      message: 'Route not found',
    });
  });
});
