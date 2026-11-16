import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const konami = readFileSync(new URL('../scripts/konami.ts', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../components/Introduction/HeroSection.tsx', import.meta.url), 'utf8');
const projectCards = readFileSync(new URL('../components/Projects/ProjectCards.tsx', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../styles/global.scss', import.meta.url), 'utf8');
const githubly = JSON.parse(readFileSync(new URL('../data/projects/githubly/project.json', import.meta.url), 'utf8'));
const scholarshipsPlus = JSON.parse(readFileSync(new URL('../data/projects/scholarshipsplus/project.json', import.meta.url), 'utf8'));
const neonGoals = JSON.parse(readFileSync(new URL('../data/projects/neongoals/project.json', import.meta.url), 'utf8'));

describe('Konami mode', () => {
  test('toggles the shared mode and preserves confetti', () => {
    expect(konami).toContain('toggleKonamiMode()');
    expect(konami).toContain("import('./konamiConfetti')");
    expect(konami).toContain('launchConfetti()');
  });

  test('switches the greeting and defers the alternate portrait URL until activation', () => {
    expect(hero).toContain("konamiMode ? 'o shit\\nwaddup'");
    expect(hero).toContain("konamiMode ? '/images/about-polaroids/casey-city-night-cutout.webp'");
  });

  test('reveals opt-in projects only while the mode is active', () => {
    expect(projectCards).toContain('!project.konamiOnly || konamiMode');
    expect(projectCards).toContain('return featuredSet.slice(0, 3)');
    expect(projectCards).toContain('visibleProjects.map');
    expect(projectCards).toContain("project-card--unlocked");
  });

  test('keeps the three new private projects behind Konami mode', () => {
    expect([githubly, scholarshipsPlus, neonGoals].map((project) => ({
      slug: project.project,
      private: project.konamiOnly,
      publicPost: project.hasPost,
    }))).toEqual([
      { slug: 'githubly', private: true, publicPost: true },
      { slug: 'scholarshipsplus', private: true, publicPost: true },
      { slug: 'neongoals', private: true, publicPost: true },
    ]);
  });

  test('changes the shared primary palette to red', () => {
    expect(theme).toMatch(/data-konami-mode='active'[\s\S]*?--color-primary: #e11d48/);
    expect(theme).toContain('--color-primary-rgb: 225, 29, 72');
  });
});
