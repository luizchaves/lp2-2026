import { z } from 'zod';

import { nonEmptyStringSchema } from '@/schemas/common.schema.ts';

const signinBodySchema = z.object({
  email: z.email(),
  password: nonEmptyStringSchema,
});

export const signinSchema = z.object({
  body: signinBodySchema,
});
