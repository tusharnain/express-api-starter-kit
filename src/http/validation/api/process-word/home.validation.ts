import { z } from 'zod';

export const HomeRequestSchema = z.object({
  name: z.string().nullable().optional(),
});

export type HomeRequestBody = z.infer<typeof HomeRequestSchema>;
