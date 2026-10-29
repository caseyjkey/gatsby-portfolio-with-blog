import { describe, expect, test } from 'bun:test';
import { nextKonamiIndex } from './konami';

const sequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

describe('Konami code matcher', () => {
  test('recognizes the complete sequence', () => {
    const finalIndex = sequence.reduce(nextKonamiIndex, 0);
    expect(finalIndex).toBe(sequence.length);
  });

  test('accepts uppercase letter keys', () => {
    const finalIndex = [...sequence.slice(0, -2), 'B', 'A'].reduce(nextKonamiIndex, 0);
    expect(finalIndex).toBe(sequence.length);
  });

  test('resets after a wrong key while preserving a new first key', () => {
    expect(nextKonamiIndex(4, 'x')).toBe(0);
    expect(nextKonamiIndex(4, 'ArrowUp')).toBe(1);
  });
});

