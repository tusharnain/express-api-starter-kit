import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import { ApiError } from '@/http/errors/api-error';

describe('ApiError', () => {
  it('should initialize with correct properties', () => {
    const error = new ApiError('Test error', 400, 'ERR_CODE');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('ERR_CODE');
  });

  it('should have default status code 500', () => {
    const error = new ApiError('Fatal error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBeUndefined();
  });

  it('should return a JSON response via respond method', () => {
    const error = new ApiError('Validation failed', 422, 'VALIDATION_ERROR');

    // Partially mock Express Response
    const mockStatus = vi.fn().mockReturnThis();
    const mockJson = vi.fn().mockReturnThis();

    const mockRes = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;

    error.respond(mockRes);

    expect(mockStatus).toHaveBeenCalledWith(422);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should omit code in response if not provided', () => {
    const error = new ApiError('Simple error', 400);
    const mockJson = vi.fn();
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: mockJson,
    } as unknown as Response;

    error.respond(mockRes);

    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Simple error',
    });
  });
});
