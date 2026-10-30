import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import ProjectCards, { __test__ } from './ProjectCards';
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
  const renderCardsMarkup = (projects: ProjectRecord[]) =>
    renderToStaticMarkup(<ProjectCards projects={projects} title="Projects" subtitle="Test" />);

  test('renders cards without action buttons', () => {
    const markup = renderCardsMarkup([liveProject]);

    expect(markup).not.toContain('Open Details');
    expect(markup).not.toContain('Live Site');
    expect(markup).not.toContain('Source');
  });

  test('formats live badges like the Gatsby card metadata row', () => {
    const markup = renderCardsMarkup([liveProject]);

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

    expect(icons.map(({ name, label }) => ({ name, label }))).toEqual([
      { name: 'FaReact', label: 'React' },
      { name: 'SiGraphql', label: 'GraphQL' },
    ]);
  });

  test('decodes a gallery image before allowing its crossfade', async () => {
    let requestedUrl = '';
    let decoded = false;
    const image = {
      complete: false,
      naturalWidth: 0,
      addEventListener: () => undefined,
      decode: async () => {
        decoded = true;
      },
      get src() {
        return requestedUrl;
      },
      set src(value: string) {
        requestedUrl = value;
      },
    } as unknown as HTMLImageElement;

    await __test__.decodeGalleryImage('/assets/farmx-alt.png', () => image);

    expect(requestedUrl).toBe('/assets/farmx-alt.png');
    expect(decoded).toBe(true);
  });

  test('uses persistent gallery slides instead of exit-remount animation', async () => {
    const [componentSource, projectStyles] = await Promise.all([
      Bun.file(new URL('./ProjectCards.tsx', import.meta.url)).text(),
      Bun.file(new URL('./projects.scss', import.meta.url)).text(),
    ]);

    expect(componentSource).not.toContain('<AnimatePresence');
    expect(componentSource).toContain("project-modal__slide${index === activeImageIndex ? ' is-active' : ''}");
    expect(projectStyles).toMatch(/\.project-modal__slide[\s\S]*?opacity: 0;[\s\S]*?&\.is-active[\s\S]*?opacity: 1/);
  });
});
