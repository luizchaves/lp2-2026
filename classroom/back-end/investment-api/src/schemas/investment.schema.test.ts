import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createInvestmentSchema,
  readInvestmentByIdSchema,
  readInvestmentsSchema,
} from '@/schemas/investment.schema.ts';

/**
 * Teste unitário: exercita uma função pura, sem servidor, sem banco e sem rede.
 * Um schema recebe um objeto e devolve `success` — nada mais. É por isso que
 * este arquivo roda em milissegundos, enquanto o de rotas leva quase um segundo.
 */
describe('investment.schema', () => {
  const validBody = {
    name: 'Tesouro Selic 2029',
    amount: 100000,
    interest: '100% Selic',
    dueDate: '2029-03-01',
    categoryId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    brokerId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
  };

  describe('corpo da requisicao', () => {
    it('aceita um corpo completo', () => {
      const result = createInvestmentSchema.safeParse({ body: validBody });

      assert.equal(result.success, true);
    });

    it('recusa nome com menos de 3 caracteres', () => {
      const result = createInvestmentSchema.safeParse({
        body: { ...validBody, name: 'TS' },
      });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['body', 'name']);
    });

    it('recusa valor negativo', () => {
      const result = createInvestmentSchema.safeParse({
        body: { ...validBody, amount: -1 },
      });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['body', 'amount']);
    });

    it('recusa valor que nao e inteiro', () => {
      const result = createInvestmentSchema.safeParse({
        body: { ...validBody, amount: 10.5 },
      });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['body', 'amount']);
    });

    it('recusa data fora do formato ISO (YYYY-MM-DD)', () => {
      const result = createInvestmentSchema.safeParse({
        body: { ...validBody, dueDate: '01/03/2029' },
      });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['body', 'dueDate']);
    });

    it('acumula um issue por campo invalido', () => {
      const result = createInvestmentSchema.safeParse({
        body: { ...validBody, name: 'TS', amount: -1 },
      });

      assert.equal(result.error?.issues.length, 2);
    });
  });

  describe('parametro de rota', () => {
    it('aceita um UUID', () => {
      const result = readInvestmentByIdSchema.safeParse({
        params: { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
      });

      assert.equal(result.success, true);
    });

    it('aceita um CUID', () => {
      const result = readInvestmentByIdSchema.safeParse({
        params: { id: 'cjld2cjxh0000qzrmn831i7rn' },
      });

      assert.equal(result.success, true);
    });

    it('recusa um id que nao e UUID nem CUID', () => {
      const result = readInvestmentByIdSchema.safeParse({
        params: { id: 'abc' },
      });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['params', 'id']);
    });
  });

  describe('query string', () => {
    it('aceita a ausencia do filtro', () => {
      const result = readInvestmentsSchema.safeParse({ query: {} });

      assert.equal(result.success, true);
    });

    it('recusa o filtro presente e vazio', () => {
      const result = readInvestmentsSchema.safeParse({ query: { name: '' } });

      assert.equal(result.success, false);
      assert.deepEqual(result.error?.issues[0]?.path, ['query', 'name']);
    });
  });
});
