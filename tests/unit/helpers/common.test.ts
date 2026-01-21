import { describe, it, expect, vi } from 'vitest';
import { config } from '@/config/config';
import { environment, abort_unless } from '@/helpers/common';

// Mock config
vi.mock('@/config/config', () => ({
  config: {
    environment: 'development',
  },
}));

describe('Common Helpers', () => {
  describe('environment()', () => {
    it('should return the current environment when no arguments are passed', () => {
      expect(environment()).toBe('development');
    });

    it('should return true if the passed environment matches the current one', () => {
      expect(environment('development' as Environment)).toBe(true);
    });

    it('should return false if the passed environment does not match the current one', () => {
      expect(environment('production' as Environment)).toBe(false);
    });

    it('should reflect changes in config (dynamic check)', () => {
      const configObj = config as { environment: string };
      configObj.environment = 'production';
      expect(environment()).toBe('production');
      expect(environment('production' as Environment)).toBe(true);

      // Reset for other tests
      configObj.environment = 'development';
    });
  });

  describe('abort_unless()', () => {
    it('should not throw if condition is truthy', () => {
      expect(() => abort_unless(true, 'Failed')).not.toThrow();
      expect(() => abort_unless('exists', 'Failed')).not.toThrow();
      expect(() => abort_unless(1, 'Failed')).not.toThrow();
    });

    it('should throw if condition is falsy', () => {
      expect(() => abort_unless(false, 'Failed')).toThrow('Failed');
      expect(() => abort_unless(null, 'Null error')).toThrow('Null error');
      expect(() => abort_unless(undefined, 'Undefined error')).toThrow('Undefined error');
    });

    it('should throw simple exception if no message is provided', () => {
      expect(() => abort_unless(false)).toThrow();
    });
  });
});
