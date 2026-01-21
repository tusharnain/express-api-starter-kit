import { describe, it, expect } from 'vitest';
import { environment } from '@/helpers/common';

describe('Common Utils', () => {
  it('should return the current environment', () => {
    const env = environment();
    expect(['development', 'production', 'testing']).toContain(env);
  });

  it('should verify the current environment', () => {
    const isDev = environment('development');
    const isProd = environment('production');
    const curr = environment();

    expect(isDev).toBe(curr === 'development');
    expect(isProd).toBe(curr === 'production');
  });
});
