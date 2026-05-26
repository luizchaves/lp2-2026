import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import Investment from '@/models/Investment.ts';

const router = Router();

class HttpError extends Error {
  code: number;

  constructor(message: string, code: number = 400) {
    super(message);
    this.code = code;
  }
}

router.post('/investments', async (req: Request, res: Response) => {
  try {
    const investment = req.body as { name: string; value: number };

    const createdInvestment = await Investment.create(investment);

    return res.json(createdInvestment);
  } catch (error) {
    throw new HttpError('Unable to create investment', 400);
  }
});

router.get('/investments', async (req: Request, res: Response) => {
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
});

router.get(
  '/investments/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      const investment = await Investment.readById(id);

      res.json(investment);
    } catch (error) {
      throw new HttpError('Unable to find investment', 400);
    }
  },
);

router.put(
  '/investments/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const investment = req.body as { name: string; value: number };
      const { id } = req.params;

      const updatedInvestment = await Investment.update({ ...investment, id });

      return res.json(updatedInvestment);
    } catch (error) {
      throw new HttpError('Unable to update investment', 400);
    }
  },
);

router.delete(
  '/investments/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      if (await Investment.remove(id)) {
        return res.sendStatus(204);
      }

      throw new HttpError('Unable to remove investment', 400);
    } catch (error) {
      throw new HttpError('Unable to remove investment', 400);
    }
  },
);

// 404 handler
router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Content not found!' });
});

// Error handler
router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;
