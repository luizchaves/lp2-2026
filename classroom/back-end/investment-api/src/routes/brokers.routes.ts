import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import BrokerController from '@/controllers/brokers.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';

const router = Router();

router.post('/brokers', isAuthenticated, requireJson, BrokerController.create);
router.get('/brokers', isAuthenticated, BrokerController.read);
router.get('/brokers/:id', isAuthenticated, BrokerController.readById);
router.put(
  '/brokers/:id',
  isAuthenticated,
  requireJson,
  BrokerController.update,
);
router.delete('/brokers/:id', isAuthenticated, BrokerController.remove);

export default router;
