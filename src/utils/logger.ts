import pino from 'pino';
import { config } from '@/config/config';

const logger = pino({
  level: config.logLevel,
  customLevels: {
    success: 35,
  },
  transport: config.logPretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          customLevels: 'trace:10,debug:20,info:30,success:35,warn:40,error:50,fatal:60',
          customColors: 'trace:gray,debug:magenta,info:blue,success:green,warn:yellow,error:red,fatal:bgRed',
        },
      }
    : undefined,
});

declare module 'pino' {
  interface BaseLogger {
    success: LogFn;
  }
}

export default logger;
