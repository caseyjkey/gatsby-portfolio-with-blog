import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://keycasey.com',
  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'night-owl',
    },
  },
});
