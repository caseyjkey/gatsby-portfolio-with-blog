import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const gate = readFileSync(new URL('../scripts/konamiGatedContent.ts', import.meta.url), 'utf8');
const blogIndex = readFileSync(new URL('../pages/blog/index.astro', import.meta.url), 'utf8');
const blogPost = readFileSync(new URL('../pages/blog/[...slug].astro', import.meta.url), 'utf8');
const projectPost = readFileSync(new URL('../pages/projects/[slug].astro', import.meta.url), 'utf8');
const contentConfig = readFileSync(new URL('../content.config.ts', import.meta.url), 'utf8');

const postDirs = [
  '2026-01-neongoals',
  '2025-01-githubly',
  '2024-10-scholarshipsplus',
  '2019-08-hat',
  '2019-08-tripco',
  '2018-12-uxportfolio',
];

describe('Konami-gated posts', () => {
  test('the schema exposes the konamiOnly flag on both collections', () => {
    expect(contentConfig.match(/konamiOnly: z\.boolean\(\)\.default\(false\)/g)).toHaveLength(2);
  });

  test('every private project post is flagged konamiOnly', () => {
    postDirs.forEach((dir) => {
      const post = readFileSync(
        new URL(`../../posts/projects/${dir}/index.mdx`, import.meta.url),
        'utf8',
      );
      expect(post).toContain('konamiOnly: true');
    });
  });

  test('the blog list hides gated entries until the mode is active', () => {
    expect(blogIndex).toContain('data-konami-only={post.data.konamiOnly');
    expect(blogIndex).toContain('hidden={post.data.konamiOnly}');
    expect(blogIndex).toContain('post-entry--unlocked');
    expect(blogIndex).toContain('data-konami-locked-hint');
  });

  test('post detail pages gate their content the same way', () => {
    expect(blogPost).toContain('data-konami-only={post.data.konamiOnly');
    expect(blogPost).toContain('hidden={post.data.konamiOnly}');
    expect(blogPost).toContain('post--unlocked');
    expect(projectPost).toContain('data-konami-only={project.data.konamiOnly');
    expect(projectPost).toContain('hidden={project.data.konamiOnly}');
    expect(projectPost).toContain('project--unlocked');
  });

  test('unlocked posts get the red shimmer treatment', () => {
    expect(blogIndex).toContain('post-unlocked-shimmer');
    expect(blogPost).toContain('blog-post-unlocked-shimmer');
    expect(projectPost).toContain('project-post-unlocked-shimmer');
    expect(blogIndex).toContain('var(--color-primary-rgb)');
  });

  test('the gate script reacts to Konami mode changes and page swaps', () => {
    expect(gate).toContain("document.documentElement.dataset.konamiMode === 'active'");
    expect(gate).toContain("window.addEventListener('portfolio-konami-mode-change'");
    expect(gate).toContain("document.addEventListener('astro:page-load'");
    expect(gate).toContain('element.hidden = !active');
    expect(gate).toContain('is-unlocked');
  });
});
