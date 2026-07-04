import type { Request, Response } from 'express';

import Broker from '@/models/Broker.ts';
import HttpError from '@/errors/HttpError.ts';
import { users } from '@/database/seeders.json' with { type: 'json' };
import type { Broker as BrokerType } from '@/types/Broker.d.ts';

const ADMIN_USER_ID = users[0].id; // Assuming the first user is the admin user

async function create(req: Request, res: Response) {
  try {
    const broker = req.body as Omit<BrokerType, 'id'>;

    const createdBroker = await Broker.create(broker);

    return res.json(createdBroker);
  } catch (error) {
    throw new HttpError('Unable to create broker', 400);
  }
}

async function read(req: Request, res: Response) {
  try {
    const brokers = await Broker.read();

    res.json(brokers);
  } catch (error) {
    throw new HttpError('Unable to read brokers', 400);
  }
}

async function readById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const broker = await Broker.readById(id);

    res.json(broker);
  } catch (error) {
    throw new HttpError('Unable to find broker', 400);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  try {
    const broker = req.body as Omit<BrokerType, 'id'>;
    const { id } = req.params;

    const updatedBroker = await Broker.update({ ...broker, id });

    return res.json(updatedBroker);
  } catch (error) {
    throw new HttpError('Unable to update broker', 400);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    if (await Broker.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove broker', 400);
  } catch (error) {
    throw new HttpError('Unable to remove broker', 400);
  }
}

export default { create, read, readById, update, remove };
