import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

describe('NavBar glass surface', () => {
  const source = readFileSync(new URL('./NavBar.tsx', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('./navigation.scss', import.meta.url), 'utf8');

  test('keeps only the homepage hero navbar transparent at the top', () => {
    expect(source).toContain('!isHomePage || scrolled || isMenuOpen');
    expect(source).toContain("data-surface={usesGlassSurface ? 'glass' : 'transparent'}");
  });

  test('applies a visible cross-browser glass treatment', () => {
    expect(styles).toContain('&[data-surface="glass"]');
    expect(styles).toContain('backdrop-filter: saturate(180%) blur(18px)');
    expect(styles).toContain('-webkit-backdrop-filter: saturate(180%) blur(18px)');
    expect(styles).toContain('@supports not');
  });
});
