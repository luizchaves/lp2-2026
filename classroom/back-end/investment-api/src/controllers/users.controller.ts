import type { Request, Response } from 'express';

import User from '@/models/User.ts';
import HttpError from '@/errors/HttpError.ts';
import type { UserInput } from '@/types/User.d.ts';

async function create(req: Request, res: Response) {
  try {
    const user = req.body as UserInput;

    const createdUser = await User.create(user);

    return res.json(createdUser);
  } catch (error) {
    throw new HttpError('Unable to create user', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const users = await User.read();

    res.json(users);
  } catch (error) {
    throw new HttpError('Unable to read users', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const user = await User.readById(id);

    res.json(user);
  } catch (error) {
    throw new HttpError('Unable to find user', 400);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const user = req.body as UserInput;
    const { id } = req.params;

    const updatedUser = await User.update({ ...user, id });

    return res.json(updatedUser);
  } catch (error) {
    throw new HttpError('Unable to update user', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    if (await User.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove user', 400);
  } catch (error) {
    throw new HttpError('Unable to remove user', 400);
  }
}

export default { create, read, readById, update, remove };
