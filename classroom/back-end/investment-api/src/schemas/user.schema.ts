import { z } from 'zod';

import {
  nonEmptyStringSchema,
  paramsWithIdSchema,
} from '@/schemas/common.schema.ts';

const userBodySchema = z.object({
  name: nonEmptyStringSchema.min(3),
  email: z.email(),
  password: z.string().min(5),
});

const updateUserBodySchema = userBodySchema.partial().refine(
  (user) => Object.values(user).some((value) => value !== undefined),
  'at least one field must be provided',
);

export const createUserSchema = z.object({
  body: userBodySchema,
});

export const readUserByIdSchema = z.object({
  params: paramsWithIdSchema,
});

export const updateUserSchema = z.object({
  body: updateUserBodySchema,
  params: paramsWithIdSchema,
});

export const removeUserSchema = readUserByIdSchema;
