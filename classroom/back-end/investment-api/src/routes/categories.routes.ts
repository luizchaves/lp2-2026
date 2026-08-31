import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import CategoryController from '@/controllers/categories.controller.ts';
import { isAuthenticated } from '@/middlewares/auth.ts';
import { validate } from '@/middlewares/validate.ts';
import {
  createCategorySchema,
  readCategoryByIdSchema,
  removeCategorySchema,
  updateCategorySchema,
} from '@/schemas/category.schema.ts';

const router = Router();

router.post(
  '/categories',
  isAuthenticated,
  requireJson,
  validate(createCategorySchema),
  CategoryController.create,
);
router.get('/categories', isAuthenticated, CategoryController.read);
router.get(
  '/categories/:id',
  isAuthenticated,
  validate(readCategoryByIdSchema),
  CategoryController.readById,
);
router.put(
  '/categories/:id',
  isAuthenticated,
  requireJson,
  validate(updateCategorySchema),
  CategoryController.update,
);
router.delete(
  '/categories/:id',
  isAuthenticated,
  validate(removeCategorySchema),
  CategoryController.remove,
);

export default router;
