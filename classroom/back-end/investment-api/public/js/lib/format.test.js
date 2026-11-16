import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDate } from './format.js';

describe('formatCurrency', () => {
  it('formata um numero em reais', () => {
    // Atenção ao separador: `Intl.NumberFormat` usa espaço NÃO-QUEBRÁVEL
    // (U+00A0) entre o símbolo e o número, e não o espaço comum.
    // Comparar com 'R$ 1.000,00' digitado com a barra de espaço falha.
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
  });

  it('sempre usa duas casas decimais', () => {
    expect(formatCurrency(1)).toBe('R$ 1,00');
    expect(formatCurrency(1.5)).toBe('R$ 1,50');
  });

  it('formata zero sem sinal negativo', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});

describe('formatDate', () => {
  it('formata no padrao brasileiro', () => {
    expect(formatDate('2025-02-10T12:00:00Z')).toBe('10/02/2025');
  });

  it('nao recua um dia para data sem hora', () => {
    // '2025-02-10' é interpretado como meia-noite UTC; como o formatador
    // também usa timeZone UTC, o dia não muda em fusos negativos.
    expect(formatDate('2025-02-10')).toBe('10/02/2025');
  });

  it('devolve vazio para data invalida', () => {
    expect(formatDate('nao-e-data')).toBe('');
  });
});
