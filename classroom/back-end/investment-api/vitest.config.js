import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // Só os módulos reutilizáveis do front. Os arquivos de tela
      // (home.js, signin.js, signup.js) manipulam o DOM de uma página
      // real e são cobertos pelo E2E, não por teste de unidade.
      include: ['public/js/lib/**/*.js'],
      exclude: ['**/*.test.js'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, functions: 80, branches: 75 },
    },
  },
});
