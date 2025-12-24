import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casesCollection = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.enum(['restorations', 'endodontics', 'fixed-prosthodontics', 'extractions', 'periodontics', 'other']),
    date: z.date(),
    patientAge: z.number().optional(),
    patientGender: z.enum(['male', 'female']).optional(),
    toothNumber: z.string().optional(),
    chiefComplaint: z.string().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string(),
    materials: z.array(z.string()).optional(),
    difficulties: z.array(z.string()).optional(),
    learnings: z.string().optional(),
    outcome: z.enum(['excellent', 'good', 'satisfactory', 'needs-follow-up']).optional(),
    followUp: z.string().optional(),
    images: z.array(z.object({
      src: image(),
      alt: z.string(),
      stage: z.enum(['before', 'during', 'after', 'xray', 'other']).optional(),
    })),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    thumbnail: image().optional(),
  }),
});

export const collections = {
  cases: casesCollection,
};
