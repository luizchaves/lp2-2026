import { z } from 'zod';

import {
  nonEmptyStringSchema,
  paramsWithIdSchema,
} from '@/schemas/common.schema.ts';

const brokerBodySchema = z.object({
  name: nonEmptyStringSchema,
});

export const createBrokerSchema = z.object({
  body: brokerBodySchema,
});

export const readBrokerByIdSchema = z.object({
  params: paramsWithIdSchema,
});

export const updateBrokerSchema = z.object({
  body: brokerBodySchema,
  params: paramsWithIdSchema,
});

export const removeBrokerSchema = readBrokerByIdSchema;
