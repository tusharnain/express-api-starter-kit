declare module 'morgan-body' {
  import type { Express } from 'express';
  interface MorganBodyOptions {
    maxBodyLength?: number;
    logRequestBody?: boolean;
    logResponseBody?: boolean;
    dateTimeFormat?: string;
    noColors?: boolean;
    stream?: { write(str: string): void };
  }
  function morganBody(app: Express, options?: MorganBodyOptions): void;
  export default morganBody;
}
