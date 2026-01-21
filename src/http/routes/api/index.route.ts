import { Router } from 'express';
import homeController from '@/http/controllers/api/home.controller';
import validateRequest from '@/http/middleware/validate-request.middleware';
import { HomeRequestSchema } from '@/http/validation/api/home.validation';

const router: Router = Router();

router.post('/submit', validateRequest(HomeRequestSchema), homeController.index);

export default router;
