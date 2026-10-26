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

  test('aligns desktop and mobile navbar controls independently', () => {
    expect(styles).toMatch(/breakpoint-up\(lg\)[\s\S]*?\.navbar-brand\s*{[\s\S]*?margin-bottom: 0\.8rem/);
    expect(styles).toMatch(/breakpoint-down\(lg\)[\s\S]*?\.hamburger-toggle\s*{[\s\S]*?margin-right: 0\.1rem[\s\S]*?padding-bottom: 0\.8rem/);
  });

  test('keeps the open mobile drawer scrollable within the viewport', () => {
    expect(styles).toMatch(/\[data-open="true"\][\s\S]*?height: calc\(100dvh - #\{\$nav-height\}\)/);
    expect(styles).toMatch(/\[data-open="true"\][\s\S]*?max-height: calc\(100dvh - #\{\$nav-height\}\)/);
    expect(styles).toMatch(/\[data-open="true"\][\s\S]*?overflow-y: auto/);
    expect(styles).toContain('overscroll-behavior: contain');
    expect(styles).toContain('justify-content: safe center');
    expect(styles).toMatch(/\.navbar-collapse[\s\S]*?breakpoint-down\(lg\)[\s\S]*?box-sizing: border-box/);
  });
});
