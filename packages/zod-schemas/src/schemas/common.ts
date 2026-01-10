import { z } from 'zod';

export const idSchema = z.string().trim().uuid('Id must be a valid UUID');

export const paginationSchema = z
  .object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
  })
  .strict();

export type IdInput = z.infer<typeof idSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
