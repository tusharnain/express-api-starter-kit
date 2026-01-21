import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { server } from '@/http/index';

const app = server.app;

describe('Global Error Handler', () => {
  it('should handle 404 - Not Found', async () => {
    const res = await request(app).get('/a-route-that-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message.toLowerCase()).toContain('not found');
  });

  it('should handle validation errors (400) from validateRequest', async () => {
    const res = await request(app).post('/api/submit').send({ invalid: 'field' }); // name is required

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.data).toBeDefined(); // Zod errors
  });

  it('should handle malformed JSON (400)', async () => {
    const res = await request(app).post('/api/submit').set('Content-Type', 'application/json').send('{"invalid": ');

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });
});
