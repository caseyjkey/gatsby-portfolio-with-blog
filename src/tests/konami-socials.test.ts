import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const social = readFileSync(new URL('../components/Social.tsx', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../components/Introduction/HeroSection.tsx', import.meta.url), 'utf8');

describe('Konami mode social links', () => {
  test('hero renders the mode-aware Socials component', () => {
    expect(hero).toContain('<Socials className="hero-social-list" />');
    expect(social).toContain('useKonamiMode()');
  });

  test('default mode keeps X, LinkedIn, Instagram and GitHub', () => {
    const defaults = social.slice(social.indexOf('const defaultSocials'), social.indexOf('const konamiSocials'));
    expect(defaults).toContain('https://x.com/thecaseykey');
    expect(defaults).toContain('https://linkedin.com/in/keycasey');
    expect(defaults).toContain('https://instagram.com/caseyjgkey');
    expect(defaults).toContain('https://github.com/caseyjkey');
    expect(defaults).not.toContain('soundcloud.com');
    expect(defaults).not.toContain('facebook.com');
  });

  test('konami mode swaps in SoundCloud and Facebook, dropping X and LinkedIn', () => {
    const konami = social.slice(social.indexOf('const konamiSocials'), social.indexOf('export function getSocialsForMode'));
    expect(konami).toContain('https://soundcloud.com/trk-daddy-key');
    expect(konami).toContain('https://www.facebook.com/caseyjkey');
    expect(konami).toContain('https://instagram.com/caseyjgkey');
    expect(konami).toContain('https://github.com/caseyjkey');
    expect(konami).not.toContain('x.com/thecaseykey');
    expect(konami).not.toContain('linkedin.com');
  });

  test('each mode exposes exactly four social entries', () => {
    const countLinks = (source: string) => (source.match(/link: 'https:/g) ?? []).length;
    const defaults = social.slice(social.indexOf('const defaultSocials'), social.indexOf('const konamiSocials'));
    const konami = social.slice(social.indexOf('const konamiSocials'), social.indexOf('export function getSocialsForMode'));
    expect(countLinks(defaults)).toBe(4);
    expect(countLinks(konami)).toBe(4);
  });

  test('mode selection is driven by the konami flag', () => {
    expect(social).toContain('export function getSocialsForMode(konamiMode: boolean)');
    expect(social).toContain('return konamiMode ? konamiSocials : defaultSocials');
  });
});
