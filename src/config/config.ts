import { z } from 'zod';
import environment from '@/enums/core/environment.enum';
import { ConfigSupport } from '@/support/config.support';

ConfigSupport.loadEnvironmentVariables();

const schema = z.object({
  environment: z
    .enum(Object.values(environment) as [string, ...string[]])
    .optional()
    .default(environment.production),

  logPretty: z
    .string()
    .optional()
    .default(process.env.ENVIRONMENT === environment.production ? 'false' : 'true')
    .transform((val) => val === 'true'),

  logLevel: z.enum(['trace', 'debug', 'info', 'success', 'warn', 'error', 'fatal', 'silent']).optional().default('info'),

  http: z.object({
    port: z
      .string()
      .optional()
      .default('8000')
      .transform((val: unknown) => Number(val)),

    requestBodySizeLimit: z
      .string()
      .optional()
      .default('20mb')
      .refine((val) => /^\d+(kb|mb|gb)$/i.test(val), 'REQUEST_BODY_SIZE_LIMIT must be like 100kb, 5mb, 1gb'),
  }),
});

const parsed = schema.safeParse({
  environment: process.env.ENVIRONMENT,
  logLevel: process.env.LOG_LEVEL,
  logPretty: process.env.LOG_PRETTY,
  http: {
    port: process.env.PORT,
    requestBodySizeLimit: process.env.REQUEST_BODY_SIZE_LIMIT,
  },
});

if (!parsed.success) {
  console.error('[CONFIG ERROR] Invalid environment variables');
  console.error(JSON.stringify(parsed.error.issues, null, 2));
  process.exit(1);
}

export const config = parsed.data;
