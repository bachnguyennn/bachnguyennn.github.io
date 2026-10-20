import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { projectCategories, projectStatuses } from './lib/taxonomy';

// Not routed yet; kept so the drafts stay validated.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const categoryKey = z.enum(Object.keys(projectCategories) as [keyof typeof projectCategories]);
const statusKey = z.enum(Object.keys(projectStatuses) as [keyof typeof projectStatuses]);

// One file per project: frontmatter feeds every card, filter and resume entry;
// the Markdown body is the case study at /projects/<id>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Shorter name for cards and the resume. */
      shortTitle: z.string().optional(),
      /** One sentence: what it is. */
      summary: z.string(),
      /** One sentence: the engineering problem it addresses. */
      problem: z.string(),
      categories: z.array(categoryKey).min(1),
      status: statusKey,
      /** Clarifies what "deployed" or "complete" covers. */
      statusNote: z.string().optional(),
      role: z.string(),
      period: z.string(),
      year: z.number(),
      order: z.number().default(50),
      featured: z.boolean().default(false),
      stack: z.array(z.string()).min(1),
      /** The single most meaningful verified result, with the context needed to read it. */
      result: z
        .object({ value: z.string(), label: z.string(), context: z.string().optional() })
        .optional(),
      github: z.url().optional(),
      demo: z
        .object({ url: z.url(), label: z.string(), note: z.string().optional() })
        .optional(),
      /** Card image; omitted cards render a typographic card instead. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** false = no case-study page; cards link to GitHub (or `href`). */
      caseStudy: z.boolean().default(true),
      /** Internal page that replaces the case study, e.g. /research/. */
      href: z.string().optional(),
      /** Bullets for the HTML resume. Omit to leave the project off the resume. */
      resume: z.array(z.string()).optional(),
    }),
});

export const collections = { blog, projects };
