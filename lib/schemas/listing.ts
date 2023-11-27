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
});

const bid = z.object({
  id: z.string(),
  amount: z.number(),
  bidderName: z.string(),
  created: isoDate,
});

const seller = z.object({
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable(),
});

export type Bid = z.infer<typeof bid>;

export const singleListingSchemaExtended = singleListingSchema.extend({
  seller: seller,
  bids: z.array(bid),
  _count: z.object({
    bids: z.number(),
  }),
});

export type Listing = z.infer<typeof singleListingSchema>;
export type ListingFull = z.infer<typeof singleListingSchemaExtended>;

export const allListingsSchema = z.array(singleListingSchemaExtended);
