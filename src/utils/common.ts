import { config } from '@/config/config';

export function environment(): Environment;
export function environment(env: Environment): boolean;
export function environment(env?: Environment): boolean | Environment {
  const current = config.http.environment as Environment;

  if (env) {
    return current === env;
  }

  return current;
}

const abort = (message?: string): never => {
  throw new Error(message);
};

export function abort_unless<T>(truth: T | null | undefined | false, message?: string): asserts truth is T {
  if (!truth) {
    abort(message);
  }
}
