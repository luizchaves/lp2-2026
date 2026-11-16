import { afterEach, describe, expect, it } from 'vitest';

import {
  clearToken,
  getAuthHeaders,
  getCurrentUser,
  getToken,
  loadMenu,
  setToken,
} from './session.js';

const TOKEN_STORAGE_KEY = '@invest-app:token';

/** Monta um JWT de mentira (sem assinatura válida) só para o front decodificar. */
function createFakeToken(payload) {
  const toBase64Url = (value) =>
    btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const header = { alg: 'HS256', typ: 'JWT' };

  return `${toBase64Url(header)}.${toBase64Url(payload)}.assinatura`;
}

function createValidPayload() {
  const now = Math.floor(Date.now() / 1000);

  return {
    userId: 'user-1',
    name: 'Valid User',
    email: 'valid@email.com',
    iat: now,
    exp: now + 3600,
  };
}

describe('session', () => {
  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('armazenamento do token', () => {
    it('guarda e recupera o token do localStorage', () => {
      setToken('abc.def.ghi');

      expect(getToken()).toBe('abc.def.ghi');
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('abc.def.ghi');
    });

    it('remove o token', () => {
      setToken('abc.def.ghi');
      clearToken();

      expect(getToken()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('devolve o usuario de um token valido', () => {
      setToken(createFakeToken(createValidPayload()));

      expect(getCurrentUser()).toEqual({
        id: 'user-1',
        name: 'Valid User',
        email: 'valid@email.com',
      });
    });

    it('devolve null sem token', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('limpa o token expirado e devolve null', () => {
      const payload = createValidPayload();
      payload.exp = Math.floor(Date.now() / 1000) - 1;

      setToken(createFakeToken(payload));

      expect(getCurrentUser()).toBeNull();
      expect(getToken()).toBeNull();
    });

    it('limpa um token malformado e devolve null', () => {
      setToken('nao-e-um-jwt');

      expect(getCurrentUser()).toBeNull();
      expect(getToken()).toBeNull();
    });

    it('limpa um token com payload que nao e JSON e devolve null', () => {
      setToken(`cabecalho.${btoa('nao-e-json')}.assinatura`);

      expect(getCurrentUser()).toBeNull();
      expect(getToken()).toBeNull();
    });
  });

  describe('getAuthHeaders', () => {
    it('monta o cabecalho Bearer com o token', () => {
      setToken('abc.def.ghi');

      expect(getAuthHeaders()).toEqual({ Authorization: 'Bearer abc.def.ghi' });
    });

    it('devolve objeto vazio sem token', () => {
      expect(getAuthHeaders()).toEqual({});
    });
  });

  describe('loadMenu', () => {
    it('nao faz nada em pagina sem navbar', () => {
      expect(() => loadMenu('home')).not.toThrow();
    });

    it('mostra Entrar e Cadastrar para visitante', () => {
      document.body.innerHTML = '<ul id="navbar-links"></ul>';

      loadMenu('signin');

      const links = [...document.querySelectorAll('#navbar-links a')];

      expect(links.map((link) => link.textContent.trim())).toEqual([
        'Entrar',
        'Cadastrar',
      ]);
      expect(links[0].getAttribute('aria-current')).toBe('page');
    });

    it('mostra Home e Sair para usuario autenticado', () => {
      document.body.innerHTML = '<ul id="navbar-links"></ul>';
      setToken(createFakeToken(createValidPayload()));

      loadMenu('home');

      const links = [...document.querySelectorAll('#navbar-links a')];

      expect(links.map((link) => link.textContent.trim())).toEqual([
        'Home',
        'Sair',
      ]);
    });
  });
});
