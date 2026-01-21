import type { ErrorRequestHandler, Express, RequestHandler, Router } from 'express';
import type { Server as HTTPServer } from 'http';
import { config } from '@/config/config';
import logger from '@/utils/logger';

export class Server {
  public readonly app: Express;
  private server?: HTTPServer;

  constructor(app: Express) {
    this.app = app;
  }

  public start(): this {
    this.server = this.app.listen(config.http.port);
    this.server.on('listening', () => {
      logger.success(`Server started on port ${config.http.port}`);
      logger.info(`Environment: ${config.environment}`);
    });

    this.handleStartupErrors();
    this.setupProcessHandlers();

    return this;
  }

  public use(handler: RequestHandler): this;
  public use(handler: ErrorRequestHandler): this;
  public use(path: string, handler: RequestHandler): this;
  public use(path: string, handler: ErrorRequestHandler): this;
  public use(pathOrHandler: string | RequestHandler | ErrorRequestHandler, handler?: RequestHandler | ErrorRequestHandler): this {
    if (typeof pathOrHandler === 'string' && handler) {
      this.app.use(pathOrHandler, handler);
    } else if (typeof pathOrHandler !== 'string') {
      this.app.use(pathOrHandler);
    }
    return this;
  }

  public when(condition: boolean, callback: (server: this) => void): this {
    if (condition) {
      callback(this);
    }
    return this;
  }

  public useRouter(basePath: string, router: Router): this {
    this.app.use(basePath, router);
    return this;
  }

  public useErrorHandler(handler: ErrorRequestHandler): this {
    this.app.use(handler);
    return this;
  }

  public handle404(): this {
    this.app.use((_req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found',
      } satisfies ApiResponse);
    });

    return this;
  }

  private handleStartupErrors() {
    this.server?.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.http.port} already in use`);
      } else if (err.code === 'EACCES') {
        logger.error(`Port ${config.http.port} requires elevated privileges`);
      } else {
        logger.error(err);
      }
      process.exit(1);
    });
  }

  private setupProcessHandlers() {
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('uncaughtException', (error) => {
      logger.error(error, 'Uncaught Exception');
      process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
      logger.error({ reason }, 'Unhandled Rejection');
      process.exit(1);
    });
  }

  private shutdown(signal: string) {
    logger.info(`${signal} received → shutting down...`);

    this.server?.close(() => {
      logger.success('Server closed cleanly.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
}
