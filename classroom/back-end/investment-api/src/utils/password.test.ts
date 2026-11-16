import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hashPassword, verifyPassword } from '@/utils/password.ts';

/**
 * Teste unitário: hash e verificação são funções puras. O argon2id é
 * propositalmente caro (64 MiB, 3 passes), então cada `it` chama o hash
 * poucas vezes — é o teste mais lento da camada de unidade, por design.
 */
describe('password', () => {
  describe('hashPassword', () => {
    it('devolve uma string no formato PHC do argon2id', () => {
      const hash = hashPassword('12345678');

      assert.match(
        hash,
        /^\$argon2id\$v=19\$m=65536,t=3,p=4\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/,
      );
    });

    it('nao guarda a senha em texto puro', () => {
      const hash = hashPassword('12345678');

      assert.ok(!hash.includes('12345678'));
    });

    it('gera hashes diferentes para a mesma senha (salt aleatorio)', () => {
      assert.notEqual(hashPassword('12345678'), hashPassword('12345678'));
    });
  });

  describe('verifyPassword', () => {
    it('aceita a senha correta', () => {
      const hash = hashPassword('12345678');

      assert.equal(verifyPassword('12345678', hash), true);
    });

    it('recusa uma senha errada', () => {
      const hash = hashPassword('12345678');

      assert.equal(verifyPassword('87654321', hash), false);
    });

    it('recusa um hash armazenado fora do formato PHC', () => {
      assert.equal(verifyPassword('12345678', 'nao-e-um-hash'), false);
      assert.equal(verifyPassword('12345678', ''), false);
    });

    it('recusa um hash de versao diferente do argon2 v19', () => {
      const hash = hashPassword('12345678');
      const olderVersion = hash.replace('$v=19$', '$v=16$');

      assert.equal(verifyPassword('12345678', olderVersion), false);
    });
  });
});
