import { Router } from 'express';

import AuthController from '@/controllers/auth.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';

const router = Router();

router.post('/signin', requireJson, AuthController.signin);

export default router;
