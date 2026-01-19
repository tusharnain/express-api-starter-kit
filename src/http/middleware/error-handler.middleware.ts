import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '@/http/errors/api-error';
import { environment } from '@/utils/common';
import logger from '@/utils/logger';

type MaybeErrorStatus = { statusCode?: number };

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response<ApiResponse> {
  logger.error(err);

  const error = err instanceof Error ? err : new Error(String(err));

  if (error instanceof ApiError) {
    return error.respond(res);
  }

  const isProduction: boolean = environment('production');

  const statusCode = (error as MaybeErrorStatus).statusCode !== undefined ? (error as MaybeErrorStatus).statusCode! : 500;

  const message = isProduction ? 'Internal server error' : error.message;

  const json: ApiResponse = {
    status: 'error',
    message: message ?? 'Internal server error',
  };

  return res.status(statusCode).json(json);
}
