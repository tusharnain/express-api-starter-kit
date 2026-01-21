import fs from 'fs';
import { configDotenv } from 'dotenv';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigSupport } from '@/support/config.support';

// Mock fs and resolve
vi.mock('fs');
vi.mock('path', async () => {
  const actual = await vi.importActual<{ resolve: (...args: string[]) => string }>('path');
  return {
    ...actual,
    resolve: vi.fn((...args: string[]) => actual.resolve(...args)),
  };
});

// Mock dotenv
vi.mock('dotenv', () => ({
  configDotenv: vi.fn(),
  config: vi.fn(),
}));

describe('ConfigSupport', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should load .env files in order of priority', () => {
    process.env.NODE_ENV = 'development';
    const mockExistsSync = vi.mocked(fs.existsSync);

    // Simulate .env.development exists
    mockExistsSync.mockImplementation((p: fs.PathLike) => p.toString().includes('.env.development'));

    ConfigSupport.loadEnvironmentVariables();

    expect(configDotenv).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringContaining('.env.development'),
      }),
    );
  });

  it('should fall back to .env if specific environment file does not exist', () => {
    process.env.NODE_ENV = 'production';
    const mockExistsSync = vi.mocked(fs.existsSync);

    // Simulate only .env exists
    mockExistsSync.mockImplementation((p: fs.PathLike) => p.toString().endsWith('.env'));

    ConfigSupport.loadEnvironmentVariables();

    expect(configDotenv).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringMatching(/\/\.env$/),
      }),
    );
  });

  it('should not call configDotenv if no .env files found', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    ConfigSupport.loadEnvironmentVariables();

    expect(configDotenv).not.toHaveBeenCalled();
  });
});
