import { z } from 'zod';

const cuidSchema = z.cuid();
const uuidSchema = z.uuid();

export const idSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      uuidSchema.safeParse(value).success || cuidSchema.safeParse(value).success,
    'id must be a valid UUID or CUID',
  );

export const nonEmptyStringSchema = z.string().trim().min(1);

export const paramsWithIdSchema = z.object({
  id: idSchema,
});
