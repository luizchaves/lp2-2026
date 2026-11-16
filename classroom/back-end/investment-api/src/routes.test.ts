import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '@/index.ts';

/** E-mail único por execução: rodar a suíte duas vezes não esbarra no @unique. */
function createValidUser() {
  const hash = randomBytes(20).toString('hex');

  return {
    name: `Valid ${hash}`,
    email: `valid-${hash}@email.com`,
    password: '12345678',
  };
}

function createValidInvestment(categoryId: string, brokerId: string) {
  return {
    name: 'Tesouro Selic 2029',
    amount: 100000,
    interest: '100% Selic',
    dueDate: '2029-03-01',
    categoryId,
    brokerId,
  };
}

async function loadToken(user: { email: string; password: string }) {
  const response = await request(app)
    .post('/api/signin')
    .send({ email: user.email, password: user.password });

  return response.body.token as string;
}

describe('InvestApp', () => {
  let validUser: ReturnType<typeof createValidUser>;
  let token: string;
  let categoryId: string;
  let brokerId: string;

  before(async () => {
    validUser = createValidUser();

    await request(app).post('/api/users').send(validUser);

    token = await loadToken(validUser);

    const categories = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);

    categoryId = categories.body[0].id;

    const brokers = await request(app)
      .get('/api/brokers')
      .set('Authorization', `Bearer ${token}`);

    brokerId = brokers.body[0].id;
  });

  describe('POST /api/users', () => {
    it('cria um usuario', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(createValidUser());

      assert.equal(response.statusCode, 200);
      assert.ok(response.body.id);
    });

    it('nao devolve a senha', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(createValidUser());

      assert.equal(response.body.password, undefined);
    });

    it('recusa e-mail repetido', async () => {
      const response = await request(app).post('/api/users').send(validUser);

      assert.equal(response.statusCode, 400);
    });

    it('recusa e-mail invalido', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...createValidUser(), email: 'nao-e-email' });

      assert.equal(response.statusCode, 400);
    });

    it('recusa corpo sem Content-Type application/json', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'text/plain')
        .send('name=x');

      assert.equal(response.statusCode, 400);
    });
  });

  describe('POST /api/signin', () => {
    it('devolve token com credenciais validas', async () => {
      const response = await request(app).post('/api/signin').send({
        email: validUser.email,
        password: validUser.password,
      });

      assert.equal(response.statusCode, 200);
      assert.equal(response.body.auth, true);
      assert.ok(response.body.token);
    });

    it('recusa senha errada', async () => {
      const response = await request(app)
        .post('/api/signin')
        .send({ email: validUser.email, password: 'errada00' });

      assert.equal(response.statusCode, 401);
    });

    it('recusa usuario inexistente', async () => {
      const response = await request(app)
        .post('/api/signin')
        .send({ email: 'ninguem@email.com', password: '12345678' });

      assert.equal(response.statusCode, 401);
    });
  });

  describe('GET /api/investments', () => {
    it('exige token', async () => {
      const response = await request(app).get('/api/investments');

      assert.equal(response.statusCode, 401);
      assert.equal(response.body.message, 'Token required.');
    });

    it('recusa token fora do formato Bearer', async () => {
      const response = await request(app)
        .get('/api/investments')
        .set('Authorization', 'Token abc');

      assert.equal(response.statusCode, 401);
      assert.equal(response.body.message, 'Token invalid.');
    });

    it('responde com token valido', async () => {
      const response = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 200);
      assert.ok(Array.isArray(response.body));
    });
  });

  describe('POST /api/investments', () => {
    it('cria um investimento', async () => {
      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(createValidInvestment(categoryId, brokerId));

      assert.equal(response.statusCode, 200);
      assert.equal(response.body.category.id, categoryId);
      assert.equal(response.body.broker.id, brokerId);
    });

    it('recusa corpo invalido', async () => {
      const response = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'x', amount: -1 });

      assert.equal(response.statusCode, 400);
    });

    it('recusa id de rota que nao e UUID nem CUID', async () => {
      const response = await request(app)
        .get('/api/investments/nao-e-uuid')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 400);
    });
  });

  describe('PUT /api/investments/:id', () => {
    it('atualiza um investimento', async () => {
      const created = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(createValidInvestment(categoryId, brokerId));

      const response = await request(app)
        .put(`/api/investments/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...createValidInvestment(categoryId, brokerId),
          name: 'Tesouro IPCA 2035',
        });

      assert.equal(response.statusCode, 200);
      assert.equal(response.body.name, 'Tesouro IPCA 2035');
    });
  });

  describe('DELETE /api/investments/:id', () => {
    it('remove um investimento', async () => {
      const created = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send(createValidInvestment(categoryId, brokerId));

      const response = await request(app)
        .delete(`/api/investments/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(response.statusCode, 204);
    });
  });

  describe('isolamento por dono', () => {
    it('nao mostra o investimento de outro usuario', async () => {
      const created = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...createValidInvestment(categoryId, brokerId),
          name: 'Somente do dono',
        });

      const otherUser = createValidUser();
      await request(app).post('/api/users').send(otherUser);
      const otherToken = await loadToken(otherUser);

      const response = await request(app)
        .get(`/api/investments/${created.body.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 403);
    });

    it('nao lista o investimento de outro usuario', async () => {
      const otherUser = createValidUser();
      await request(app).post('/api/users').send(otherUser);
      const otherToken = await loadToken(otherUser);

      const response = await request(app)
        .get('/api/investments')
        .set('Authorization', `Bearer ${otherToken}`);

      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, []);
    });
  });
});
