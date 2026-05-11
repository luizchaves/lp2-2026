import { Router } from 'express';

import Investment from './models/Investment.js';

const router = Router();

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

router.post('/investments', async (req, res) => {
  try {
    const investment = req.body;

    const createdInvestment = await Investment.create(investment);

    return res.json(createdInvestment);
  } catch (error) {
    throw new HttpError('Unable to create investment', 400);
  }
});

router.get('/investments', async (req, res) => {
  try {
    const { name } = req.query;

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

router.get('/investments/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const investment = await Investment.readById(id);

    res.json(investment);
  } catch (error) {
    throw new HttpError('Unable to find investment', 400);
  }
});

router.put('/investments/:id', async (req, res) => {
  try {
    const investment = req.body;

    const id = req.params.id;

    const updatedInvestment = await Investment.update({ ...investment, id });

    return res.json(updatedInvestment);
  } catch (error) {
    throw new HttpError('Unable to update investment', 400);
  }
});

router.delete('/investments/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (await Investment.remove(id)) {
      return res.sendStatus(204);
    }

    throw new HttpError('Unable to remove investment', 400);
  } catch (error) {
    throw new HttpError('Unable to remove investment', 400);
  }
});

// 404 handler
router.use((req, res, next) => {
  res.status(404).json({ error: 'Content not found!' });
});

// Error handler
router.use((err, req, res, next) => {
  // console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default router;
