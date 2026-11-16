import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { signJwt, verifyJwt } from '@/utils/jwt.ts';

/**
 * Teste unitário: assinar e verificar são funções puras (string entra, string
 * ou payload sai). Nenhum servidor, banco ou relógio externo — o tempo entra
 * pelo `expiresInSeconds`, o que permite testar expiração sem esperar.
 */
describe('jwt', () => {
  const payload = {
    userId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    name: 'Valid User',
    email: 'valid@email.com',
  };

  describe('signJwt', () => {
    it('devolve um token com tres partes separadas por ponto', () => {
      const token = signJwt(payload);

      assert.equal(token.split('.').length, 3);
    });

    it('usa apenas caracteres base64url (sem +, / ou =)', () => {
      const token = signJwt(payload);

      assert.match(token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    });
  });

  describe('verifyJwt', () => {
    it('devolve o payload de um token recem-assinado', () => {
      const verified = verifyJwt(signJwt(payload));

      assert.equal(verified.userId, payload.userId);
      assert.equal(verified.name, payload.name);
      assert.equal(verified.email, payload.email);
    });

    it('define iat agora e exp 24h depois por padrao', () => {
      const now = Math.floor(Date.now() / 1000);
      const verified = verifyJwt(signJwt(payload));

      assert.ok(Math.abs(verified.iat - now) <= 1);
      assert.equal(verified.exp - verified.iat, 60 * 60 * 24);
    });

    it('respeita um tempo de expiracao customizado', () => {
      const verified = verifyJwt(signJwt(payload, 60));

      assert.equal(verified.exp - verified.iat, 60);
    });

    it('recusa um token sem tres partes', () => {
      assert.throws(() => verifyJwt('so-uma-parte'), /Invalid token/);
      assert.throws(() => verifyJwt('duas.partes'), /Invalid token/);
    });

    it('recusa um token com payload adulterado', () => {
      const token = signJwt(payload);
      const [header, , signature] = token.split('.');

      const tamperedPayload = Buffer.from(
        JSON.stringify({ userId: 'outro-usuario', exp: 9999999999 }),
      )
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      assert.throws(
        () => verifyJwt(`${header}.${tamperedPayload}.${signature}`),
        /Invalid token signature/,
      );
    });

    it('recusa um token com assinatura adulterada', () => {
      const token = signJwt(payload);
      const [header, body] = token.split('.');

      assert.throws(
        () => verifyJwt(`${header}.${body}.assinatura-falsa`),
        /Invalid token signature/,
      );
    });

    it('recusa um token expirado', () => {
      const expiredToken = signJwt(payload, -1);

      assert.throws(() => verifyJwt(expiredToken), /Expired or invalid token/);
    });
  });
});
