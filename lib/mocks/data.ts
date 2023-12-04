import { Bid, ListingFull, Seller } from '../schemas/listing';

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
