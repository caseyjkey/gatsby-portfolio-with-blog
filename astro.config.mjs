import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

const telemetryTarget = process.env.OPS_PULSE_API ?? 'http://127.0.0.1:8788';

export default defineConfig({
  site: 'https://keycasey.com',
  publicDir: './static',
  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'night-owl',
    },
  },
  vite: {
    server: {
      proxy: {
        '/api/ops-pulse': {
          target: telemetryTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ops-pulse/, '/api/ops-pulse'),
        },
      },
    },
  },
});
