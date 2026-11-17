export type RegionalProfileId =
  | 'generic'
  | 'nyc'
  | 'dc'
  | 'miami'
  | 'la'
  | 'sf'
  | 'wyoming'
  | 'colorado';

export type RegionalProfile = {
  id: RegionalProfileId;
  label: string;
  center?: {
    latitude: number;
    longitude: number;
    radiusMiles: number;
  };
  regionCodes?: string[];
  role: string;
  descriptions: Array<{
    header: string;
    subheader: string;
  }>;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredProjectSlugs: string[];
};

export const regionalProfiles: RegionalProfile[] = [
  {
    id: 'generic',
    label: 'General',
    role: 'Founding Engineer & Systems Architect',
    descriptions: [
      {
        header: 'building for reliability.',
        subheader: 'SLA-driven cloud infrastructure and automated CI/CD observability.',
      },
      {
        header: 'engineering at scale.',
        subheader: 'High-performance backend systems and distributed data pipelines.',
      },
      {
        header: 'driving product strategy.',
        subheader: 'Bridging technical architecture with business-critical outcomes.',
      },
    ],
    featuredTitle: 'Featured Work',
    featuredSubtitle: 'Highlighted projects from my portfolio.',
    featuredProjectSlugs: ['spiritbeads', 'farmx', 'datacatalog'],
  },
  {
    id: 'nyc',
    label: 'New York & Northeast',
    center: { latitude: 40.7128, longitude: -74.006, radiusMiles: 175 },
    role: 'Financial Data & Platform Engineer',
    descriptions: [
      {
        header: 'moving data with confidence.',
        subheader: 'Self-service ingestion, Kafka stream processing, and governed metadata at scale.',
      },
      {
        header: 'building high-trust workflows.',
        subheader: 'Secure financial integrations, validation gates, and resilient release systems.',
      },
      {
        header: 'turning signals into decisions.',
        subheader: 'Real-time analytics and business intelligence tied to measurable outcomes.',
      },
    ],
    featuredTitle: 'Finance & Data Systems',
    featuredSubtitle: 'Selected work in governed data, financial insight, and dependable platforms.',
    featuredProjectSlugs: ['oracle', 'datacatalog', 'farmx'],
  },
  {
    id: 'dc',
    label: 'Washington, DC & Northern Virginia',
    center: { latitude: 38.9072, longitude: -77.0369, radiusMiles: 100 },
    role: 'Secure Cloud & DevOps Engineer',
    descriptions: [
      {
        header: 'designing for high-trust environments.',
        subheader: 'Identity-aware systems, controlled releases, and infrastructure with guardrails.',
      },
      {
        header: 'operating cloud platforms reliably.',
        subheader: 'AWS and Oracle Cloud architecture backed by automation, monitoring, and rollback.',
      },
      {
        header: 'making complex systems usable.',
        subheader: 'Self-service workflows that reduce operator overhead without weakening controls.',
      },
    ],
    featuredTitle: 'Secure Cloud Delivery',
    featuredSubtitle: 'Selected work in identity, cloud infrastructure, and reliable operations.',
    featuredProjectSlugs: ['workspaces', 'farmx', 'oracle'],
  },
  {
    id: 'miami',
    label: 'Miami & South Florida',
    center: { latitude: 25.7617, longitude: -80.1918, radiusMiles: 125 },
    role: 'AI Product & Web3 Engineer',
    descriptions: [
      {
        header: 'shipping ambitious products quickly.',
        subheader: 'Full-stack prototypes that mature into tested, production-ready systems.',
      },
      {
        header: 'building with applied AI.',
        subheader: 'Developer workflows, automation, and data products designed around real users.',
      },
      {
        header: 'exploring programmable ownership.',
        subheader: 'Hands-on blockchain product work grounded in incentives and usable interfaces.',
      },
    ],
    featuredTitle: 'AI & Web3 Products',
    featuredSubtitle: 'Selected work spanning applied AI, blockchain, and founder-led product delivery.',
    featuredProjectSlugs: ['billboard', 'farmx', 'spiritbeads'],
  },
  {
    id: 'la',
    label: 'Los Angeles & Southern California',
    center: { latitude: 34.0522, longitude: -118.2437, radiusMiles: 120 },
    role: 'Commerce & Consumer Platform Engineer',
    descriptions: [
      {
        header: 'scaling product catalogs.',
        subheader: 'Bulk ingestion and high-performance APIs for large, fast-changing datasets.',
      },
      {
        header: 'building commerce end to end.',
        subheader: 'Customer-facing storefronts, Stripe payments, and efficient content operations.',
      },
      {
        header: 'learning from audience signals.',
        subheader: 'Social sentiment and analytics transformed into clear product decisions.',
      },
    ],
    featuredTitle: 'Commerce & Consumer Systems',
    featuredSubtitle: 'Selected work in data catalogs, storefronts, and audience intelligence.',
    featuredProjectSlugs: ['datacatalog', 'spiritbeads', 'oracle'],
  },
  {
    id: 'sf',
    label: 'San Francisco Bay Area',
    center: { latitude: 37.7749, longitude: -122.4194, radiusMiles: 120 },
    role: 'Forward-Deployed AI & Platform Engineer',
    descriptions: [
      {
        header: 'building agentic workflows.',
        subheader: 'AI interfaces and reusable engineering skills that accelerate real development teams.',
      },
      {
        header: 'prototyping toward production.',
        subheader: 'Rapid full-stack delivery with high-trust integrations and rigorous UX validation.',
      },
      {
        header: 'scaling the platform underneath.',
        subheader: 'Reliable release systems, asynchronous pipelines, and infrastructure built to evolve.',
      },
    ],
    featuredTitle: 'AI Product Engineering',
    featuredSubtitle: 'Selected work in intelligent tooling, platform scale, and customer-driven delivery.',
    featuredProjectSlugs: ['farmx', 'datacatalog', 'workspaces'],
  },
  {
    id: 'wyoming',
    label: 'Wyoming',
    regionCodes: ['WY'],
    role: 'Rural Technology & IoT Engineer',
    descriptions: [
      {
        header: 'instrumenting the physical world.',
        subheader: 'IoT, telemetry, and resilient data flows for equipment, environmental, and field monitoring.',
      },
      {
        header: 'making complex operations traceable.',
        subheader: 'Governed data and blockchain patterns for trustworthy records across rural supply chains.',
      },
      {
        header: 'building for local operators.',
        subheader: 'Practical web products that help rural businesses manage work, customers, and growth.',
      },
    ],
    featuredTitle: 'Rural Technology & Connected Systems',
    featuredSubtitle: 'Selected work in IoT, traceable networks, and technology for rural entrepreneurs.',
    featuredProjectSlugs: ['hat', 'billboard', 'spiritbeads'],
  },
  {
    id: 'colorado',
    label: 'Colorado Front Range',
    center: { latitude: 40.015, longitude: -105.12, radiusMiles: 65 },
    role: 'Community & Startup Product Engineer',
    descriptions: [
      {
        header: 'helping local businesses move faster.',
        subheader: 'Bespoke web applications, commerce workflows, and automation shaped around real operators.',
      },
      {
        header: 'building technology with community impact.',
        subheader: 'Education, access, and mission-led products designed with the people they serve.',
      },
      {
        header: 'growing products alongside their users.',
        subheader: 'Full-stack delivery, DevOps, and feedback loops for startups and emerging teams.',
      },
    ],
    featuredTitle: 'Community & Startup Technology',
    featuredSubtitle: 'Selected work in education, local entrepreneurship, and practical product delivery.',
    featuredProjectSlugs: ['whatspython', 'hat', 'spiritbeads'],
  },
];

export const genericRegionalProfile = regionalProfiles[0];

export function getRegionalProfileById(id: string | null | undefined) {
  return regionalProfiles.find((profile) => profile.id === id) ?? genericRegionalProfile;
}

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function distanceMiles(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const latitudeARadians = toRadians(latitudeA);
  const latitudeBRadians = toRadians(latitudeB);
  const haversine = (
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(latitudeARadians)
      * Math.cos(latitudeBRadians)
      * Math.sin(longitudeDelta / 2) ** 2
  );
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(haversine));
}

export function selectRegionalProfile(
  latitude?: number,
  longitude?: number,
  regionCode?: string,
) {
  const normalizedRegionCode = regionCode?.trim().toUpperCase();
  if (normalizedRegionCode) {
    const stateMatch = regionalProfiles.find((profile) => (
      profile.regionCodes?.includes(normalizedRegionCode)
    ));
    if (stateMatch) return stateMatch;
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return genericRegionalProfile;
  }

  const matches = regionalProfiles
    .filter((profile) => profile.center)
    .map((profile) => ({
      profile,
      distance: distanceMiles(
        latitude as number,
        longitude as number,
        profile.center!.latitude,
        profile.center!.longitude,
      ),
    }))
    .filter(({ profile, distance }) => distance <= profile.center!.radiusMiles)
    .sort((a, b) => a.distance - b.distance);

  return matches[0]?.profile ?? genericRegionalProfile;
}
