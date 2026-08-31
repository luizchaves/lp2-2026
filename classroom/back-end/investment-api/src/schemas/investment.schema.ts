import { z } from 'zod';

import {
  idSchema,
  nonEmptyStringSchema,
  paramsWithIdSchema,
} from '@/schemas/common.schema.ts';

const investmentBodySchema = z.object({
  name: nonEmptyStringSchema.min(3),
  amount: z.number().int().positive(),
  interest: nonEmptyStringSchema,
  dueDate: z.iso.date(),
  categoryId: idSchema,
  brokerId: idSchema,
});

const investmentQuerySchema = z.object({
  name: nonEmptyStringSchema.optional(),
});

export const createInvestmentSchema = z.object({
  body: investmentBodySchema,
});

export const readInvestmentsSchema = z.object({
  query: investmentQuerySchema,
});

export const readInvestmentByIdSchema = z.object({
  params: paramsWithIdSchema,
});

export const updateInvestmentSchema = z.object({
  body: investmentBodySchema,
  params: paramsWithIdSchema,
});

export const removeInvestmentSchema = readInvestmentByIdSchema;
