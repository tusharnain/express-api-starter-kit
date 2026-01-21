import { describe, it, expect } from 'vitest';
import { config } from '@/config/config';

describe('Configuration', () => {
  it('should load values from .env.testing', () => {
    expect(config.http.port).toBe(8001);
    expect(config.environment).toBe('testing');
    expect(config.http.requestLogger.enabled).toBe(false);
  });

  it('should have valid request body size limit', () => {
    expect(config.http.requestBodySizeLimit).toMatch(/^\d+(kb|mb|gb)$/i);
  });
});
