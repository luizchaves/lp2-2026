import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import BrokerController from '@/controllers/brokers.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';
import { validate } from '@/middlewares/validate.ts';
import {
  createBrokerSchema,
  readBrokerByIdSchema,
  removeBrokerSchema,
  updateBrokerSchema,
} from '@/schemas/broker.schema.ts';

const router = Router();

router.post(
  '/brokers',
  isAuthenticated,
  requireJson,
  validate(createBrokerSchema),
  BrokerController.create,
);
router.get('/brokers', isAuthenticated, BrokerController.read);
router.get(
  '/brokers/:id',
  isAuthenticated,
  validate(readBrokerByIdSchema),
  BrokerController.readById,
);
router.put(
  '/brokers/:id',
  isAuthenticated,
  requireJson,
  validate(updateBrokerSchema),
  BrokerController.update,
);
router.delete(
  '/brokers/:id',
  isAuthenticated,
  validate(removeBrokerSchema),
  BrokerController.remove,
);

export default router;
