import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { server } from '@/http/index';

const app = server.app;

describe('API Routes', () => {
  describe('POST /api/submit', () => {
    it('should return 200 with valid data', async () => {
      const res = await request(app).post('/api/submit').send({ name: 'John Doe' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('John Doe');
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app).post('/api/submit').send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 400 when name is null', async () => {
      const res = await request(app).post('/api/submit').send({ name: null });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 400 with invalid data type', async () => {
      const res = await request(app).post('/api/submit').send({ name: 123 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 400 with malformed JSON', async () => {
      const res = await request(app).post('/api/submit').set('Content-Type', 'application/json').send('{"name": "partial" ');

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
});
