import { AuctionFull } from '@/lib/schemas';

export const normalizeResponse = (listing: AuctionFull) => {
  const sortedBids =
    listing?.bids && Array.isArray(listing.bids)
      ? listing.bids.sort((a, b) => b.amount - a.amount)
      : [];

  const active = listing?.endsAt > new Date().toISOString();
  const currentBid = sortedBids[0]?.amount || 0;

  const normalizedListing = {
    ...listing,
    bids: sortedBids,
    currentBid,
    active,
  };

  return normalizedListing;
};
