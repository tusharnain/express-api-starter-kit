import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

type ValidateSource = 'body' | 'params' | 'query';

const validateRequest = <T>(schema: ZodType<T>, source: ValidateSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[source]);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages: ValidationErrorDetail[] = error.issues.map((issue) => ({
          message: issue.path.length > 0 ? `${issue.path.join('.')} is ${issue.message}` : issue.message,
        }));

        const errorResponse: ApiResponse<ValidationErrorDetail[]> = {
          status: 'error',
          message: 'Invalid data',
          data: errorMessages,
        };

        res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      } else {
        const errorResponse: ApiResponse = {
          status: 'error',
          message: 'Internal Server Error',
        };

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
      }
    }
  };
};

export default validateRequest;
