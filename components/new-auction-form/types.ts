import { StoredData } from '@/lib/hooks/useAuctionFormStore';
import { AuctionFormComplete } from '@/lib/schemas/auctionSchema';
import { Listing, ListingFull } from '@/lib/schemas/listingSchema';
import { UpdateAuction } from '@/lib/services/updateAuction';

export type Step = 'info' | 'media' | 'time' | 'summary';

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
  getStore: () => StoredData;
  clearStore: () => void;
  updateStore: (data: StoredData) => void;
  storedData: StoredData;
  nextStep: () => void;
  prevStep: () => void;
  postListing: PostListing;
  updateAuction: UpdateAuction;
};

export type UploadImage = {
  id: string;
  file?: File;
  previewUrl: string;
  publicUrl?: string;
};
