import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './posts/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    published: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './posts/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    published: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
