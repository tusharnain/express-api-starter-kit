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

    requestLogger: z.object({
      enabled: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),

      format: z.string().optional().default('dev'),

      logRequestBody: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),

      logResponseBody: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),

      maxBodyLength: z
        .string()
        .optional()
        .default('1000')
        .transform((val) => Number(val)),
    }),
  }),
});

const parsed = schema.safeParse({
  environment: process.env.ENVIRONMENT,
  logLevel: process.env.LOG_LEVEL,
  logPretty: process.env.LOG_PRETTY,
  http: {
    port: process.env.PORT,
    requestBodySizeLimit: process.env.REQUEST_BODY_SIZE_LIMIT,
    requestLogger: {
      enabled: process.env.REQUEST_LOGGER_ENABLED,
      format: process.env.REQUEST_LOGGER_FORMAT,
      logRequestBody: process.env.REQUEST_LOGGER_LOG_REQUEST_BODY,
      logResponseBody: process.env.REQUEST_LOGGER_LOG_RESPONSE_BODY,
      maxBodyLength: process.env.REQUEST_LOGGER_MAX_BODY_LENGTH,
    },
  },
});

if (!parsed.success) {
  console.error('[CONFIG ERROR] Invalid environment variables');
  console.error(JSON.stringify(parsed.error.issues, null, 2));
  process.exit(1);
}

export const config = parsed.data;
