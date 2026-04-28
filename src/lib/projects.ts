type ProjectIconMap = Partial<Record<'di' | 'fa' | 'io' | 'si' | 'gr', string[]>>;

type RawProject = {
  image: string;
  galleryImages?: Array<{
    image: string;
  }>;
  title: string;
  subtitle: string;
  description: string;
  icons?: ProjectIconMap;
  start: string;
  end?: {
    date?: string;
    present?: boolean;
  };
  link?: string;
  sourceLink?: string;
  status?: string;
  project: string;
};

export type ProjectRecord = RawProject & {
  slug: string;
  imageUrl: string;
  galleryImageUrls: string[];
  postSlug: string;
};

export function formatProjectStatusLabel(status: string) {
  if (status === 'in-progress') return 'In Progress';
  if (status === 'beta') return 'Beta';
  return status;
}

const hasImportGlob = typeof import.meta.glob === 'function';
const projectModules = hasImportGlob
  ? import.meta.glob('../data/projects/*/project.json', { eager: true })
  : {};
const imageModules = hasImportGlob
  ? import.meta.glob('../data/projects/**/*.{png,jpg,jpeg,webp,gif}', {
      eager: true,
      import: 'default',
    })
  : {};

const imageMap = imageModules as Record<string, string | { src: string }>;

type AssetModule = string | { src: string };
type ProjectModule = { default: RawProject };
type ProjectModuleEntry = [string, unknown];
type ProjectTransformOptions = {
  imageMap: Record<string, AssetModule>;
};

const getAssetUrl = (asset: AssetModule | undefined) => {
  if (!asset) return '';
  return typeof asset === 'string' ? asset : asset.src;
};

const normalizeMonth = (value: string) => {
  const [year, month = '01'] = value.split('-');
  return `${year}-${month.padStart(2, '0')}`;
};

const buildPostSlug = (start: string, slug: string) => {
  const [year, month = '01'] = normalizeMonth(start).split('-');
  return `/projects/${year}-${month}-${slug}/`;
};

const toProjectRecord = (
  options: ProjectTransformOptions,
  [_path, mod]: ProjectModuleEntry,
): ProjectRecord => {
  const raw = (mod as ProjectModule).default;
  const slug = raw.project;
  const folderPrefix = `../data/projects/${slug}/`;
  const imageUrl = getAssetUrl(options.imageMap[`${folderPrefix}${raw.image}`]);
  const galleryImageUrls = (raw.galleryImages ?? [])
    .map(({ image }) => getAssetUrl(options.imageMap[`${folderPrefix}${image}`]))
    .filter(Boolean);

  return {
    ...raw,
    slug,
    imageUrl,
    galleryImageUrls,
    postSlug: buildPostSlug(raw.start, slug),
    start: normalizeMonth(raw.start),
    end: raw.end?.date
      ? {
          ...raw.end,
          date: normalizeMonth(raw.end.date),
        }
      : raw.end,
  };
};

const projectRecords = Object.entries(projectModules)
  .map((entry) => toProjectRecord({ imageMap }, entry))
  .sort((a, b) => b.start.localeCompare(a.start));

export function getProjects() {
  return projectRecords;
}

export function getFeaturedProjects() {
  const featured = new Set(['spiritbeads', 'farmx', 'datacatalog']);
  return projectRecords.filter((project) => featured.has(project.slug));
}

export function getProjectBySlug(slug: string) {
  return projectRecords.find((project) => project.slug === slug);
}

export const __test__ = {
  formatProjectStatusLabel,
  normalizeMonth,
  buildPostSlug,
  toProjectRecord,
};
