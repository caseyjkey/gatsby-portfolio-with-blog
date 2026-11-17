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
const opsStyles = readFileSync(
  new URL('../components/Introduction/ops-pulse.scss', import.meta.url),
  'utf8',
);
const hero = readFileSync(
  new URL('../components/Introduction/HeroSection.tsx', import.meta.url),
  'utf8',
);

describe('ASCII hero greeting', () => {
  test('renders the greeting through the particle component', () => {
    expect(hero).toContain('import AsciiGreeting');
    expect(hero).toContain("<AsciiGreeting text={konamiMode ? 'o shit\\nwaddup' : introductionData.greeting} />");
  });

  test('does not announce regional personalization in the hero', () => {
    expect(hero).not.toContain('Focused for');
    expect(hero).not.toContain('hero-market-context');
  });

  test('samples multi-line greetings as separate centered canvas lines', () => {
    expect(component).toContain("const lines = text.split('\\n')");
    expect(component).toContain('lines.forEach((line, index) =>');
    expect(styles).toMatch(/\.hero-subheader[\s\S]*?white-space: pre-line/);
  });

  test('clears the previous particle visibility state before rebuilding text', () => {
    expect(component).toContain("container.classList.remove('is-ready')");
    expect(component).toContain("heading.classList.remove('is-ascii')");
  });

  test('hides the plain heading during setup and centers the canvas on the full band', () => {
    expect(styles).toMatch(/\.hero-greeting \.hero-subheader\s*{\s*color: transparent/);
    expect(component).toContain("container.style.left = '50%'");
    expect(component).toContain("container.style.transform = 'translateX(-50%)'");
  });

  test('pins the experience CTA about three ems from the viewport bottom', () => {
    expect(styles).toMatch(/\.hero-resume-btn\s*{[\s\S]*?bottom: 48px/);
  });

  test('keeps the real heading available to assistive technology', () => {
    expect(component).toContain('ref={headingRef}');
    expect(component).toContain('{text}');
    expect(styles).toMatch(/\.hero-greeting \.hero-subheader\s*{\s*color: transparent/);
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

  test('keeps mobile readable and simulates only touch-disturbed glyphs', () => {
    expect(component).toContain('const MOBILE_FPS = 30');
    expect(component).toContain('const MOBILE_SETTLED_FPS = 20');
    expect(component).toContain('const MOBILE_SAMPLE_STEP = 4');
    expect(component).toContain('const MOBILE_GLYPH_SIZE = 6');
    expect(component).toContain("const GLYPH_SET_MOBILE = '01';");
    expect(component).toContain('let mobileStaticLayer: HTMLCanvasElement | null = null');
    expect(component).toContain('let mobileGlyphPoints:');
    expect(component).toContain('let mobileMotes: MobileMote[] = []');
    expect(component).toContain('context.drawImage(mobileStaticLayer, 0, 0, width, height)');
    expect(component).toContain('staticContext.fillText(glyph, x, y)');
    expect(component).toContain('mobileGlyphPoints.push({ char: glyph, x, y })');
    expect(component).toContain('const MOBILE_MAX_ACTIVE = 64');
    expect(component).toContain('const MAX_DESKTOP_PARTICLES = 1500');
    expect(component).toContain('const MAX_MOBILE_PARTICLES = 320');
    expect(component).toContain('const MOBILE_INTERACTION_FPS = 24');
    expect(component).toContain('const MOBILE_REPULSION_SCALE = 1.35');
    expect(component).toContain('const stepMobileMotes = () =>');
    expect(component).toContain('const push = falloff * repulsionForce');
    expect(component).toContain('pointerVelocityX * falloff * 0.08');
    expect(component).toContain('const disturbMobile = (');
    expect(component).toContain('gestureX * 0.18');
    expect(component).toContain('mote.vx += (mote.homeX - mote.x) * MOBILE_SPRING_STRENGTH');
    expect(component).toContain('pointerX = point.x;');
    expect(component).toContain('mobileMotes.splice(farthestIndex, 1)');
    expect(component).toContain('context.globalCompositeOperation = \'destination-out\'');
    expect(component).toContain('mote.x,');
    expect(component).toContain('mote.y - glyphSize * 0.62');
    expect(component).toContain('paintMobile();');
    expect(component).toContain('thinParticles(collected, maxParticles - dustCount)');
    expect(component).not.toContain('rippleSources');
    expect(component).toContain('if (mobileMotes.length > 0) startMobile()');
    expect(component).not.toContain('createRadialGradient');
    expect(component).not.toContain("staticContext.letterSpacing");
    // Desktop particle count is capped to preserve visible flow without
    // saturating the motion into a dense moving mass.
    expect(component).toContain('const textParticles = thinParticles(collected, maxParticles - dustCount)');
  });

  test('leaves a narrow mobile gutter between the Ops Pulse pill and greeting', () => {
    expect(opsStyles).toMatch(/@media \(max-width: 767\.98px\)[\s\S]*?top: 64px/);
    expect(styles).toMatch(/\.hero-text[\s\S]*?margin-top: calc\(1em \+ 17px\)/);
  });
});
