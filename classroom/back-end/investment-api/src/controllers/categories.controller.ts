import type { Request, Response } from 'express';

import Category from '@/models/Category.ts';
import HttpError from '@/errors/HttpError.ts';
import type { Category as CategoryType } from '@/types/Category.d.ts';

async function create(req: Request, res: Response) {
  try {
    const category = req.body as Omit<CategoryType, 'id'>;

    const createdCategory = await Category.create(category);

    return res.json(createdCategory);
  } catch (error) {
    throw new HttpError('Unable to create category', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const categories = await Category.read();

    res.json(categories);
  } catch (error) {
    throw new HttpError('Unable to read categories', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const category = await Category.readById(id);

    res.json(category);
  } catch (error) {
    throw new HttpError('Unable to find category', 400);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const category = req.body as Omit<CategoryType, 'id'>;
    const { id } = req.params;

    const updatedCategory = await Category.update({ ...category, id });

    return res.json(updatedCategory);
  } catch (error) {
    throw new HttpError('Unable to update category', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    if (await Category.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove category', 400);
  } catch (error) {
    throw new HttpError('Unable to remove category', 400);
  }
}

export default { create, read, readById, update, remove };
