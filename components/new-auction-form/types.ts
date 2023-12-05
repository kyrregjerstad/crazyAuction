import { ListingFull } from '@/lib/schemas/listing';

export const validSteps = ['info', 'media', 'time', 'summary'] as const;

export type Step = (typeof validSteps)[number];

export type NewAuctionFormProps = {
  mode?: 'create' | 'edit';
  listing: ListingFull | null;
};

export type UploadImage = {
  id: string;
  file?: File;
  previewUrl: string;
  publicUrl?: string;
};
