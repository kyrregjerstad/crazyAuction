import { z } from 'zod';

export const auctionFormInfoSchema = z.object({
  title: z.string().min(3).max(280),
  description: z.string().max(280).optional(),
  tags: z.string().optional(),
});

export const auctionFormMediaSchema = z.object({
  imageUrls: z.array(z.string().url()),
});

export const auctionFormDateSchema = z.object({
  dateTime: z.string(),
});

export const auctionFormSchemaComplete = z.object({
  ...auctionFormInfoSchema.shape,
  ...auctionFormMediaSchema.shape,
  ...auctionFormDateSchema.shape,
});

export type AuctionFormComplete = z.infer<typeof auctionFormSchemaComplete>;
export type AuctionFormInfo = z.infer<typeof auctionFormInfoSchema>;
export type AuctionFormMedia = z.infer<typeof auctionFormMediaSchema>;
export type AuctionFormDate = z.infer<typeof auctionFormDateSchema>;
