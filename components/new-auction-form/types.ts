import { StoredData } from '@/lib/hooks/useAuctionFormStore';
import { AuctionFormComplete, Auction, AuctionFull } from '@/lib/schemas';
import { type UpdateAuction } from '@/lib/services/auction-api';

export type Step = 'info' | 'media' | 'time' | 'summary';

export type AuctionForm = {
  mode?: 'create' | 'edit';
  listing: AuctionFull | null;
};

export type PostListing = ({
  formData,
}: {
  formData: AuctionFormComplete;
}) => Promise<Auction>;

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
