import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

describe('mobile homepage layout', () => {
  test('keeps every expertise illustration before its content', () => {
    const styles = readFileSync(
      new URL('../components/Skills/skills.scss', import.meta.url),
      'utf8',
    );

    expect(styles).toMatch(/\.illustration-col[\s\S]*?&--bottom[\s\S]*?max-width: 767\.98px[\s\S]*?order: -1/);
  });

  test('uses a compact mobile timeline content offset', () => {
    const styles = readFileSync(
      new URL('../components/Experience/experience.scss', import.meta.url),
      'utf8',
    );

    expect(styles).toMatch(/\.timeline-entry[\s\S]*?max-width: 767\.98px[\s\S]*?padding-left: 1\.25rem/);
  });
});
