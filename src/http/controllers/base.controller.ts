import type { Request, Response, NextFunction, RequestHandler } from 'express';

export abstract class BaseController {
  protected asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  protected respond<T>(res: Response<ApiResponse<T>>, options: { data: T } & RespondOptions): Response<ApiResponse<T>>;
  protected respond(res: Response<ApiResponse<undefined>>, options?: RespondOptions): Response<ApiResponse<undefined>>;
  protected respond<T>(res: Response, options: { data?: T } & RespondOptions): Response {
    const { data = null, message = null, status = 'success', httpStatus = 200 } = options;

    const payload: ApiResponse<T | null> = {
      status,
      message,
      data,
    };

    return res.status(httpStatus).json(payload);
  }
}

interface RespondOptions {
  message?: string | null;
  status?: ApiResponseStatus;
  httpStatus?: number;
}
