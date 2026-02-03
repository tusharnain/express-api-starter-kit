declare module 'morgan-body' {
  import type { Express, Request, Response } from 'express';

  interface MorganBodyOptions {
    maxBodyLength?: number;

    logRequestBody?: boolean;
    logResponseBody?: boolean;

    logReqHeaderList?: string[];
    logResHeaderList?: string[];

    logAllReqHeader?: boolean;
    logAllResHeader?: boolean;

    prettify?: boolean;
    dateTimeFormat?: 'iso' | 'utc' | 'local' | string;
    noColors?: boolean;

    skip?: (req: Request, res: Response) => boolean;

    stream?: {
      write(str: string): void;
    };
  }

  function morganBody(app: Express, options?: MorganBodyOptions): void;
  export default morganBody;
}
