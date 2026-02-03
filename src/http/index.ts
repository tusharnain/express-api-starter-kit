import express from 'express';
import { config } from '@/config/config';
import { errorHandler } from '@/http/middleware/error-handler.middleware';
import apiRouter from '@/http/routes/api/index.route';
import webRouter from '@/http/routes/web.route';
import { Server } from '@/http/server';

export const server = new Server(express())
  .use(express.json({ limit: config.http.requestBodySizeLimit }))
  .useRouter('/', webRouter)
  .useRouter('/api', apiRouter)
  .handle404()
  .useErrorHandler(errorHandler);

if (process.env.NODE_ENV !== 'testing') {
  server.start();
}
