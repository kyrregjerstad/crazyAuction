import { AuctionFormComplete } from '@/lib/schemas/auctionForm';
import { Listing, ListingFull } from '@/lib/schemas/listing';

export const validSteps = ['info', 'media', 'time', 'summary'] as const;

export type Step = (typeof validSteps)[number];

export type AuctionForm = {
  mode?: 'create' | 'edit';
  listing: ListingFull | null;
};

export type PostListing = ({
  formData,
}: {
  formData: AuctionFormComplete;
}) => Promise<Listing>;

export type FormStepProps = AuctionForm & {
  currentStep: Step;
  getStore: () => AuctionFormComplete;
  clearStore: () => void;
  updateStore: (data: Partial<AuctionFormComplete>) => void;
  nextStep: () => void;
  prevStep: () => void;
  postListing: PostListing;
};

export type UploadImage = {
  id: string;
  file?: File;
  previewUrl: string;
  publicUrl?: string;
};
