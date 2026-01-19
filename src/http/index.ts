import express from 'express';
import { config } from '@/config/config';
import { errorHandler } from '@/http/middleware/error-handler.middleware';
import { requestLogger } from '@/http/middleware/request-logger.middleware';
import apiRouter from '@/http/routes/api/index.route';
import webRouter from '@/http/routes/web.route';
import { Server } from '@/http/server';

export const server = new Server(express())
  .use(express.json({ limit: config.http.requestBodySizeLimit }))
  .use(requestLogger)
  .useRouter('/', webRouter)
  .useRouter('/api', apiRouter)
  .handle404()
  .useErrorHandler(errorHandler);

server.start();
