import { describe, expect, test } from 'bun:test';
import { __test__ } from './ProjectCards';
import type { ProjectRecord } from '../../lib/projects';

const liveProject: ProjectRecord = {
  slug: 'farmx',
  image: 'cover.png',
  imageUrl: '/assets/farmx-cover.png',
  galleryImageUrls: ['/assets/farmx-cover.png', '/assets/farmx-alt.png'],
  title: 'FarmX',
  subtitle: 'Platform',
  description: '<p>Project description</p>',
  start: '2024-04',
  end: { present: true },
  status: 'live',
  project: 'farmx',
  postSlug: '/projects/2024-04-farmx/',
  link: 'https://example.com',
  sourceLink: 'https://github.com/example/farmx',
};

describe('ProjectCards', () => {
  test('renders cards without action buttons', () => {
    const markup = __test__.renderCardsMarkup([liveProject]);

    expect(markup).not.toContain('Open Details');
    expect(markup).not.toContain('Live Site');
    expect(markup).not.toContain('Source');
  });

  test('formats live badges like the Gatsby card metadata row', () => {
    const markup = __test__.renderCardsMarkup([liveProject]);

    expect(markup).toContain('project-card__badge');
    expect(markup).toContain('project-card__badge-dot');
    expect(markup).toContain('>live<');
  });

  test('formats status labels for non-live projects', () => {
    expect(__test__.formatStatusLabel('in-progress')).toBe('In Progress');
    expect(__test__.formatStatusLabel('beta')).toBe('Beta');
  });

  test('prefers the JSON-defined gallery order without injecting the card image', () => {
    expect(
      __test__.getGallery({
        ...liveProject,
        imageUrl: '/assets/card-cover.png',
      }),
    ).toEqual(['/assets/farmx-cover.png', '/assets/farmx-alt.png']);

    expect(
      __test__.getGallery({
        ...liveProject,
        galleryImageUrls: [],
      }),
    ).toEqual(['/assets/farmx-cover.png']);
  });

  test('resolves project technology icons from the JSON icon map', () => {
    const icons = __test__.getTechnologyIcons({
      ...liveProject,
      icons: {
        fa: ['FaReact'],
        si: ['SiGraphql'],
      },
    });

    expect(icons.map((icon) => icon.name)).toEqual(['FaReact', 'SiGraphql']);
  });
});
