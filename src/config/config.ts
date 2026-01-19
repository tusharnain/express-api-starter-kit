import { configDotenv } from 'dotenv';
import { z } from 'zod';
import environment from '@/enums/core/environment.enum';
import logger from '@/utils/logger';

configDotenv({
  quiet: true,
});

const schema = z.object({
  http: z.object({
    port: z
      .string()
      .optional()
      .default('8000')
      .transform((val: unknown) => Number(val)),

    environment: z
      .enum(Object.values(environment) as [string, ...string[]])
      .optional()
      .default(environment.production),

    requestBodySizeLimit: z
      .string()
      .optional()
      .default('20mb')
      .refine((val) => /^\d+(kb|mb|gb)$/i.test(val), 'REQUEST_BODY_SIZE_LIMIT must be like 100kb, 5mb, 1gb'),

    requestLogger: z.object({
      logRequestBody: z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),

      logResponseBody: z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    }),
  }),
});

const parsed = schema.safeParse({
  http: {
    port: process.env.PORT,
    environment: process.env.ENVIRONMENT,
    requestBodySizeLimit: process.env.REQUEST_BODY_SIZE_LIMIT,
    requestLogger: {
      logRequestBody: process.env.REQUEST_LOGGER_LOG_REQUEST_BODY,
      logResponseBody: process.env.REQUEST_LOGGER_LOG_RESPONSE_BODY,
    },
  },
});

if (!parsed.success) {
  logger.error('Invalid environment variables');
  logger.error(parsed.error.issues);
  process.exit(1);
}

export const config = parsed.data;
