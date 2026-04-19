export const siteMetadata = {
  title: 'Casey Key',
  description:
    'Casey Key is a software engineer in California with a focus on education, finance, and security with expertise in cloud-native architecture and full-stack development.',
  author: 'Casey Key',
  canonical: 'https://keycasey.com',
  siteUrl: 'https://keycasey.com',
  image: '/homepage.png',
  twitterUsername: '@thecaseykey',
} as const;

export type SiteMetadata = typeof siteMetadata;
