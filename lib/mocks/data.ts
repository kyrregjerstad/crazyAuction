import { StoredData } from '../hooks/useAuctionFormStore';
import { Bid, ListingFull, Seller } from '../schemas/listingSchema';
import { RegisterResponse } from '../schemas/registerSchema';

export const emptyRegisterResponse = {
  id: 0,
  name: '',
  email: '',
  avatar: '',
  credits: 0,
} as RegisterResponse;

const emptySeller = {
  name: '',
  email: '',
  avatar: '',
} as Seller;

export const emptyBid = {
  id: '',
  amount: 0,
  created: '',
  bidderName: '',
} as Bid;

export const emptyListing = {
  id: '',
  title: '',
  description: '',
  tags: [],
  media: [],
  created: '',
  updated: '',
  endsAt: '',
  seller: emptySeller,
  bids: [],
  _count: {
    bids: 0,
  },
} as ListingFull;

export const createStoredDataMock = (params?: StoredData): StoredData => {
  return {
    id: params?.id,
    title: params?.title || '',
    description: params?.description || '',
    tags: params?.tags || [],
    imageUrls: params?.imageUrls || [],
    dateTime: params?.dateTime || '',
  };
};
