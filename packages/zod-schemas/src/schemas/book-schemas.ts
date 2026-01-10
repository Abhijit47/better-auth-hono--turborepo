import * as z from 'zod';

export const bookSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).max(500),
  author: z.string().trim().min(1).max(100),
});

export type Book = z.infer<typeof bookSchema>;
