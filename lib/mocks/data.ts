import { Bid, ListingFull, Seller } from '../schemas/listing';
import { RegisterResponse } from '../schemas/register';
import { User } from '../schemas/user';

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
