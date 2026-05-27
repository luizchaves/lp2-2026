import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import BrokerController from '@/controllers/brokers.controller.ts';

const router = Router();

router.post('/brokers', requireJson, BrokerController.create);
router.get('/brokers', BrokerController.read);
router.get('/brokers/:id', BrokerController.readById);
router.put('/brokers/:id', requireJson, BrokerController.update);
router.delete('/brokers/:id', BrokerController.remove);

export default router;
