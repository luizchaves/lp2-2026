import type { Request, Response } from 'express';

import Investment from '@/models/Investment.ts';
import HttpError from '@/errors/HttpError.ts';
import { users } from '@/database/seeders.json' with { type: 'json' };
import type { InvestmentInput } from '@/types/Investment.d.ts';

const ADMIN_USER_ID = users[0].id; // Assuming the first user is the admin user

async function create(req: Request, res: Response) {
  try {
    const investment = req.body as InvestmentInput;

    const createdInvestment = await Investment.create({
      ...investment,
      userId: ADMIN_USER_ID,
    });

    return res.json(createdInvestment);
  } catch (error) {
    throw new HttpError('Unable to create investment', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const { name } = req.query as { name?: string };

    let investments;

    if (name) {
      investments = await Investment.read('name', name);
    } else {
      investments = await Investment.read();
    }

    res.json(investments);
  } catch (error) {
    throw new HttpError('Unable to read investments', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const investment = await Investment.readById(id);

    res.json(investment);
  } catch (error) {
    throw new HttpError('Unable to find investment', 400);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const investment = req.body as InvestmentInput;
    const { id } = req.params;

    const updatedInvestment = await Investment.update({
      ...investment,
      id,
      userId: ADMIN_USER_ID,
    });

    return res.json(updatedInvestment);
  } catch (error) {
    throw new HttpError('Unable to update investment', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    if (await Investment.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove investment', 400);
  } catch (error) {
    throw new HttpError('Unable to remove investment', 400);
  }
}

export default { create, read, readById, update, remove };
