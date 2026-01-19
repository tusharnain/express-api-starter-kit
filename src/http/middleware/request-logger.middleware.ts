import type { Request, Response, NextFunction } from 'express';
import { config } from '@/config/config';
import logger from '@/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  const originalBody = config.http.requestLogger.logRequestBody ? JSON.stringify(req.body) : null;

  if (config.http.requestLogger.logResponseBody) {
    interceptResponseBody(res);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);

    if (originalBody !== null) {
      logger.request('REQUEST BODY', originalBody);
    }
  });

  next();
};

const interceptResponseBody = (res: Response): void => {
  const chunks: Buffer[] = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = function (chunk: unknown): boolean {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    return originalWrite(chunk);
  };

  res.end = function (chunk?: unknown): Response {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }

    const body = Buffer.concat(chunks).toString('utf8');
    logger.request('RESPONSE BODY', body);

    return originalEnd(chunk);
  };
};
