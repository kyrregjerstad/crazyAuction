import { z } from 'zod';

const isoDate = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date format, expected ISO 8601 format',
});

export const singleAuctionSchema = z.object({
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

export const singleAuctionSchemaExtended = singleAuctionSchema.extend({
  seller: seller,
  bids: z.array(bid),
  _count: z.object({
    bids: z.number(),
  }),
});

export const voidSchema = z.void();

export type Seller = z.infer<typeof seller>;
export type Bid = z.infer<typeof bid>;
export type Auction = z.infer<typeof singleAuctionSchema>;
export type AuctionFull = z.infer<typeof singleAuctionSchemaExtended>;

export const allAuctionsSchema = z.array(singleAuctionSchemaExtended);
