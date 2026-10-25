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
    expect(styles).toMatch(/\.timeline-year[\s\S]*?max-width: 767\.98px[\s\S]*?margin-top: 4px/);
  });

  test('keeps the desktop year clear of the timeline dot without changing mobile geometry', () => {
    const styles = readFileSync(
      new URL('../components/Experience/experience.scss', import.meta.url),
      'utf8',
    );

    expect(styles).toMatch(/\.timeline-year[\s\S]*?min-width: 60px;[\s\S]*?box-sizing: border-box/);
    expect(styles).toMatch(/\.timeline-year[\s\S]*?max-width: 767\.98px[\s\S]*?box-sizing: content-box/);
  });

  test('moves scaled illustration whitespace above the ML and cloud artwork', () => {
    const styles = readFileSync(
      new URL('../components/Skills/skills.scss', import.meta.url),
      'utf8',
    );

    expect(styles).toMatch(/&--ai-systems[\s\S]*?max-width: 767\.98px[\s\S]*?transform-origin: bottom center/);
    expect(styles).toMatch(/&--infrastructure[\s\S]*?max-width: 767\.98px[\s\S]*?margin-top: 0[\s\S]*?transform-origin: bottom center/);
    expect(styles).not.toContain('margin-top: -3rem !important');
  });

  test('reveals each expertise bullet list from its own viewport observer', () => {
    const source = readFileSync(
      new URL('../components/Skills/SkillsSection.tsx', import.meta.url),
      'utf8',
    );

    expect(source).toContain('ref={skillListRef}');
    expect(source).toContain("animate={isSkillListVisible ? 'visible' : 'hidden'}");
    expect(source).not.toContain('isVisible={true}');
  });

  test('keeps the AWS wordmark white when dark-mode extensions rewrite SVG fills', () => {
    const source = readFileSync(
      new URL('../components/Skills/SkillsSection.tsx', import.meta.url),
      'utf8',
    );
    const styles = readFileSync(
      new URL('../components/Skills/skills.scss', import.meta.url),
      'utf8',
    );

    expect(source).toContain('className="aws-logo"');
    expect(styles).toMatch(/\.aws-logo path:first-child\s*{\s*fill: #fff !important/);
  });
});
