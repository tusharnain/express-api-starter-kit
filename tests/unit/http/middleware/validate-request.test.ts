import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import validateRequest from '@/http/middleware/validate-request.middleware';

describe('validateRequest Middleware', () => {
  const schema = z.object({
    name: z.string(),
  });

  const middleware = validateRequest(schema);

  const createMockRes = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should call next() if validation passes', () => {
    const mockReq = {
      body: { name: 'Alice' },
    } as Request;
    const mockRes = createMockRes();
    const mockNext = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should send 400 and not call next() if validation fails', () => {
    const mockReq = {
      body: { name: 123 }, // Invalid type
    } as Request;
    const mockRes = createMockRes();
    const mockNext = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Invalid data',
      }),
    );
  });

  it('should validate query if source is set to query', () => {
    const querySchema = z.object({ id: z.string() });
    const queryMiddleware = validateRequest(querySchema, 'query');

    const mockReq = {
      query: { id: 'test-id' },
    } as unknown as Request;
    const mockRes = createMockRes();
    const mockNext = vi.fn();

    queryMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();

    const invalidReq = {
      query: {},
    } as unknown as Request;
    const invalidRes = createMockRes();
    queryMiddleware(invalidReq, invalidRes, mockNext);
    expect(invalidRes.status).toHaveBeenCalledWith(400);
  });
});
