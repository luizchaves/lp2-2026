import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import UserController from '@/controllers/users.controller.ts';

const router = Router();

router.post('/users', requireJson, UserController.create);
router.get('/users', UserController.read);
router.get('/users/:id', UserController.readById);
router.put('/users/:id', requireJson, UserController.update);
router.delete('/users/:id', UserController.remove);

export default router;
