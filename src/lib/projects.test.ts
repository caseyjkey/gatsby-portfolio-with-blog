import { describe, expect, test } from 'bun:test';
import {
  __test__,
} from './projects';

describe('project helpers', () => {
  test('normalizes partial year-month values', () => {
    expect(__test__.normalizeMonth('2024-4')).toBe('2024-04');
    expect(__test__.normalizeMonth('2024-12')).toBe('2024-12');
  });

  test('builds project post slugs from dates and slugs', () => {
    expect(__test__.buildPostSlug('2024-4', 'farmx')).toBe('/projects/2024-04-farmx/');
  });

  test('creates project records with resolved image URLs', () => {
    const record = __test__.toProjectRecord(
      {
        imageMap: {
          '../data/projects/demo/images/cover.png': '/assets/cover.png',
          '../data/projects/demo/images/alt.png': { src: '/assets/alt.png' },
        },
      },
      [
        '../data/projects/demo/project.json',
        {
          default: {
            image: 'images/cover.png',
            title: 'Demo',
            subtitle: 'Prototype',
            description: '<p>Test</p>',
            start: '2024-4',
            end: { date: '2024-9' },
            status: 'beta',
            project: 'demo',
          },
        },
      ],
    );

    expect(record.imageUrl).toBe('/assets/cover.png');
    expect(record.galleryImageUrls).toEqual(['/assets/alt.png', '/assets/cover.png']);
    expect(record.postSlug).toBe('/projects/2024-04-demo/');
    expect(record.end?.date).toBe('2024-09');
  });
});
