import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import CategoryController from '@/controllers/categories.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';

const router = Router();

router.post(
  '/categories',
  isAuthenticated,
  requireJson,
  CategoryController.create,
);
router.get('/categories', isAuthenticated, CategoryController.read);
router.get('/categories/:id', isAuthenticated, CategoryController.readById);
router.put(
  '/categories/:id',
  isAuthenticated,
  requireJson,
  CategoryController.update,
);
router.delete('/categories/:id', isAuthenticated, CategoryController.remove);

export default router;
