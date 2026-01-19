import { Router } from 'express';
import type { Request, Response } from 'express';

const router: Router = Router();

router.all('/', (_req: Request, res: Response) => res.json({ status: true }));

export default router;
