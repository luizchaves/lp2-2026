import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import UserController from '@/controllers/users.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';
import { validate } from '@/middlewares/validate.ts';
import {
  createUserSchema,
  readUserByIdSchema,
  removeUserSchema,
  updateUserSchema,
} from '@/schemas/user.schema.ts';

const router = Router();

router.post('/users', requireJson, validate(createUserSchema), UserController.create);
router.get('/users/me', isAuthenticated, UserController.readMe);
router.get('/users', isAuthenticated, UserController.read);
router.get(
  '/users/:id',
  isAuthenticated,
  validate(readUserByIdSchema),
  UserController.readById,
);
router.put(
  '/users/:id',
  isAuthenticated,
  requireJson,
  validate(updateUserSchema),
  UserController.update,
);
router.delete(
  '/users/:id',
  isAuthenticated,
  validate(removeUserSchema),
  UserController.remove,
);

export default router;
