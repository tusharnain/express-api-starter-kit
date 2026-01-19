import type { HomeRequestBody } from '@/http/validation/api/process-word/home.validation';
import type { Request, Response } from 'express';
import { BaseController } from '@/http/controllers/base.controller';

class HomeController extends BaseController {
  public index = this.asyncHandler((req: Request<unknown, unknown, HomeRequestBody>, res: HomeApiResponseType): HomeApiResponseType => {
    const name = req.body.name;
    const message = 'Howdy! ' + name;

    return this.respond(res, { message });
  });
}

type HomeApiResponseType = Response<ApiResponse>;

export default new HomeController();
