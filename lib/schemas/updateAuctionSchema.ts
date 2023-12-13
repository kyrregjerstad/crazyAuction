import { z } from 'zod';

export const updateAuctionSchema = z.object({
  title: z.string().min(1).max(280).optional(),
  description: z.string().min(1).max(280).nullable().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  tags: z
    .array(z.string())
    .max(8, 'A maximum of 8 tags are allowed')
    .optional(),
});

export type UpdateAuctionForm = z.infer<typeof updateAuctionSchema>;
