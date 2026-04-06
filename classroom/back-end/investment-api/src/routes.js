import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { investments } from './data/investments.js';

const route = Router();

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

route.post('/investments', (req, res) => {
  const { name, value } = req.body;

  if (!name || !value) {
    throw new HttpError('Name and value are required');
  }

  const id = uuidv4();

  const investment = { id, name, value };

  investments.push(investment);

  return res.status(201).json(investment);
});

route.get('/investments', (req, res) => {
  return res.json(investments);
});

route.get('/investments/:id', (req, res) => {
  const { id } = req.params;

  const investment = investments.find((investment) => investment.id === id);

  if (!investment) {
    return res.status(404).json({ error: 'Investment not found' });
  }

  return res.json(investment);
});

route.put('/investments/:id', (req, res) => {
  const { name, value } = req.body;

  if (!name || !value) {
    throw new HttpError('Name and value are required');
  }

  const { id } = req.params;

  const index = investments.findIndex((investment) => investment.id === id);

  if (index === -1) {
    throw new HttpError('Investment not found', 404);
  }

  const updatedInvestment = { id, name, value };

  investments[index] = updatedInvestment;

  return res.json(updatedInvestment);
});

route.delete('/investments/:id', (req, res) => {
  const { id } = req.params;

  const index = investments.findIndex((investment) => investment.id === id);

  if (index === -1) {
    throw new HttpError('Investment not found', 404);
  }

  investments.splice(index, 1);

  return res.status(204).send();
});

// 404 handler
route.use((req, res, next) => {
  res.status(404).json({ error: 'Content not found!' });
});

// Error handler
route.use((err, req, res, next) => {
  // console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Something broke!' });
});

export default route;
