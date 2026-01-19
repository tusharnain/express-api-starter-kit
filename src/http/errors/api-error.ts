import type { Response } from 'express';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  public respond = (res: Response): Response<ApiResponse> => {
    const json: ApiResponse = {
      status: 'error',
      message: this.message,
    };

    if (this.code) {
      json.code = this.code;
    }

    return res.status(this.statusCode).json(json);
  };
}
