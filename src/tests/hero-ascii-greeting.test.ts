import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const component = readFileSync(
  new URL('../components/Introduction/AsciiGreeting.tsx', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../components/Introduction/hero.scss', import.meta.url),
  'utf8',
);
const hero = readFileSync(
  new URL('../components/Introduction/HeroSection.tsx', import.meta.url),
  'utf8',
);

describe('ASCII hero greeting', () => {
  test('renders the greeting through the particle component', () => {
    expect(hero).toContain('import AsciiGreeting');
    expect(hero).toContain('<AsciiGreeting text={introductionData.greeting} />');
  });

  test('keeps the real heading available to assistive technology', () => {
    expect(component).toContain('ref={headingRef}');
    expect(component).toContain('{text}');
    expect(styles).toMatch(/\.hero-subheader\.is-ascii\s*{\s*color: transparent/);
  });

  test('skips the effect entirely under reduced motion', () => {
    expect(component).toContain("prefers-reduced-motion: reduce");
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ascii-hero\s*{\s*display: none/);
  });

  test('supports mouse hover plus touch tap, hold, drag, and release', () => {
    expect(component).toContain("addEventListener('pointerdown'");
    expect(component).toContain("addEventListener('pointermove'");
    expect(component).toContain("addEventListener('pointerup'");
    expect(component).toContain("addEventListener('pointercancel'");
    expect(component).toContain('setPointerCapture(event.pointerId)');
    expect(component).toContain('clearPointer()');
    expect(styles).toMatch(/\.ascii-hero[\s\S]*?canvas\s*{[\s\S]*?touch-action: none/);
  });

  test('pauses the animation off-screen and when the tab is hidden', () => {
    expect(component).toContain('IntersectionObserver');
    expect(component).toContain("addEventListener('visibilitychange'");
  });

  test('paces frames and caps the mobile particle budget', () => {
    expect(component).toContain('const MOBILE_FPS = 30');
    expect(component).toContain('const MOBILE_SETTLED_FPS = 20');
    expect(component).toContain('const MAX_MOBILE_PARTICLES = 340');
    expect(component).toContain("const GLYPH_SET_MOBILE = '.:+-=#';");
    expect(component).toContain('const dustRatio = isMobile ? 0.05 : 0.15');
    expect(component).toContain('if (items.length <= limit) return items.slice()');
    expect(component).toContain('thinParticles(collected, maxParticles - dustCount)');
  });
});
