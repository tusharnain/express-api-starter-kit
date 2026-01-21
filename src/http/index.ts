import express from 'express';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import { config } from '@/config/config';
import { errorHandler } from '@/http/middleware/error-handler.middleware';
import apiRouter from '@/http/routes/api/index.route';
import webRouter from '@/http/routes/web.route';
import { Server } from '@/http/server';

export const server = new Server(express())
  .use(express.json({ limit: config.http.requestBodySizeLimit }))
  .when(config.http.requestLogger.enabled, (s: Server) => {
    s.use(morgan(config.http.requestLogger.format));
    morganBody(s.app, {
      maxBodyLength: config.http.requestLogger.maxBodyLength,
      logRequestBody: config.http.requestLogger.logRequestBody,
      logResponseBody: config.http.requestLogger.logResponseBody,
      dateTimeFormat: 'iso',
      noColors: false,
    });
  })
  .useRouter('/', webRouter)
  .useRouter('/api', apiRouter)
  .handle404()
  .useErrorHandler(errorHandler);

if (process.env.NODE_ENV !== 'testing') {
  server.start();
}
