import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import UserController from '@/controllers/users.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';

const router = Router();

router.post('/users', requireJson, UserController.create);
router.get('/users/me', isAuthenticated, UserController.readMe);
router.get('/users', isAuthenticated, UserController.read);
router.get('/users/:id', isAuthenticated, UserController.readById);
router.put('/users/:id', isAuthenticated, requireJson, UserController.update);
router.delete('/users/:id', isAuthenticated, UserController.remove);

export default router;
