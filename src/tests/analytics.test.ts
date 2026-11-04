import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const layout = readFileSync(
  new URL('../layouts/BaseLayout.astro', import.meta.url),
  'utf8',
);
const workflow = readFileSync(
  new URL('../../.github/workflows/deploy.yml', import.meta.url),
  'utf8',
);
const productionEnvironment = readFileSync(
  new URL('../../.env.production', import.meta.url),
  'utf8',
);

describe('Google Analytics integration', () => {
  test('uses validated production configuration instead of a hardcoded measurement ID', () => {
    expect(layout).toContain('import.meta.env.VITE_GA_MEASUREMENT_ID');
    expect(layout).toContain("/^G-[A-Z0-9]+$/");
    expect(layout).toContain('import.meta.env.PROD');
    expect(layout).not.toMatch(/G-[A-Z0-9]{6,}/);
  });

  test('queues native gtag arguments and initializes the tag once', () => {
    expect(layout).toContain('window.dataLayer.push(arguments)');
    expect(layout).toContain('window.__portfolioAnalyticsInitialized');
    expect(layout).toContain('window.gtag(\'config\', gaMeasurementId)');
  });

  test('tracks the public production ID without a GitHub Settings dependency', () => {
    expect(productionEnvironment).toMatch(
      /^VITE_GA_MEASUREMENT_ID=G-[A-Z0-9]+$/m,
    );
    expect(workflow).not.toContain('vars.VITE_GA_MEASUREMENT_ID');
    expect(workflow).not.toContain('secrets.VITE_GA_MEASUREMENT_ID');
  });
});
