import { z } from 'zod';

const isoDate = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date format, expected ISO 8601 format',
});

export const singleListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  media: z.array(z.string().url()),
  created: isoDate,
  updated: isoDate,
  endsAt: isoDate,
  seller: z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().nullable(),
  }),
  bids: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      bidderName: z.string(),
      created: isoDate,
    }),
  ),
  _count: z.object({
    bids: z.number(),
  }),
});

export type SingleListing = z.infer<typeof singleListingSchema>;

export const allListingsSchema = z.array(singleListingSchema);
