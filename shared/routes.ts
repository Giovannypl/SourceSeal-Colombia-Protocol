
import { z } from 'zod';
import { insertSealSchema, insertReportSchema, seals, reports, enforcements } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  seals: {
    create: {
      method: 'POST' as const,
      path: '/api/seals',
      input: insertSealSchema,
      responses: {
        201: z.custom<typeof seals.$inferSelect>(), // Returns the created seal
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/seals',
      responses: {
        200: z.array(z.custom<typeof seals.$inferSelect & { reportCount: number; enforcementLevel: number }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/seals/:id',
      responses: {
        200: z.custom<typeof seals.$inferSelect & { reports: typeof reports.$inferSelect[]; enforcements: typeof enforcements.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    ethicalFilter: {
      method: 'POST' as const,
      path: '/api/ethical-filter',
      input: z.object({
        zkpCommitment: z.string(),
        description: z.string(),
      }),
      responses: {
        201: z.custom<typeof enforcements.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  reports: {
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof enforcements.$inferSelect | { message: string }>(), // Returns enforcement action if triggered, or status message
        400: errorSchemas.validation,
      },
    },
  },
  enforcement: {
    simulate: {
      method: 'POST' as const,
      path: '/api/enforcement/simulate',
      input: z.object({
        sealId: z.number(),
        financialUsd: z.number(),
      }),
      responses: {
        200: z.custom<typeof enforcements.$inferSelect | { message: string }>(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
