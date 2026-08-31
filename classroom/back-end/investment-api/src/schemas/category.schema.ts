import { z } from 'zod';

import {
  nonEmptyStringSchema,
  paramsWithIdSchema,
} from '@/schemas/common.schema.ts';

const categoryBodySchema = z.object({
  name: nonEmptyStringSchema,
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'invalid hex color'),
});

export const createCategorySchema = z.object({
  body: categoryBodySchema,
});

export const readCategoryByIdSchema = z.object({
  params: paramsWithIdSchema,
});

export const updateCategorySchema = z.object({
  body: categoryBodySchema,
  params: paramsWithIdSchema,
});

export const removeCategorySchema = readCategoryByIdSchema;
