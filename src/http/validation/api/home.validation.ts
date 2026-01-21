import { z } from 'zod';

export const HomeRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type HomeRequestBody = z.infer<typeof HomeRequestSchema>;
