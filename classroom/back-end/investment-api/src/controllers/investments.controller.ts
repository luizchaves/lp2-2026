import type { Request, Response } from 'express';

import Investment from '@/models/Investment.ts';
import HttpError from '@/errors/HttpError.ts';
import type { InvestmentInput } from '@/types/Investment.d.ts';

function getUserId(req: Request): string {
  if (!req.userId) {
    throw new HttpError('Unauthorized', 401);
  }

  return req.userId;
}

async function create(req: Request, res: Response) {
  try {
    const investment = req.body as InvestmentInput;
    const userId = getUserId(req);

    const createdInvestment = await Investment.create({
      ...investment,
      userId,
    });

    return res.json(createdInvestment);
  } catch (error) {
    throw new HttpError('Unable to create investment', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };
    const userId = getUserId(req);
    const filters = name ? { name, userId } : { userId };

    const investments = await Investment.read(filters);

    res.json(investments);
  } catch (error) {
    throw new HttpError('Unable to read investments', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const investment = await Investment.readById(id);

    if (investment.userId !== userId) {
      throw new HttpError('Unauthorized', 403);
    }

    res.json(investment);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError('Unable to find investment', 400);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const investment = req.body as InvestmentInput;
    const { id } = req.params;
    const userId = getUserId(req);

    const existingInvestment = await Investment.readById(id);

    if (existingInvestment.userId !== userId) {
      throw new HttpError('Unauthorized', 403);
    }

    const updatedInvestment = await Investment.update({
      ...investment,
      id,
      userId,
    });

    return res.json(updatedInvestment);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError('Unable to update investment', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const investment = await Investment.readById(id);

    if (investment.userId !== userId) {
      throw new HttpError('Unauthorized', 403);
    }

    if (await Investment.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove investment', 400);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError('Unable to remove investment', 400);
  }
}

export default { create, read, readById, update, remove };
