import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { Router } from 'express';
import CategoryController from '@/controllers/categories.controller.ts';

const router = Router();

router.post('/categories', requireJson, CategoryController.create);
router.get('/categories', CategoryController.read);
router.get('/categories/:id', CategoryController.readById);
router.put('/categories/:id', requireJson, CategoryController.update);
router.delete('/categories/:id', CategoryController.remove);

export default router;
