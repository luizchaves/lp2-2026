import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import InvestmentController from '@/controllers/investments.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';

const router = Router();

router.post(
  '/investments',
  isAuthenticated,
  requireJson,
  InvestmentController.create,
);
router.get('/investments', isAuthenticated, InvestmentController.read);
router.get('/investments/:id', isAuthenticated, InvestmentController.readById);
router.put(
  '/investments/:id',
  isAuthenticated,
  requireJson,
  InvestmentController.update,
);
router.delete('/investments/:id', isAuthenticated, InvestmentController.remove);

export default router;
