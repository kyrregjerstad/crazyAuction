import { emptyAuction } from '@/lib/mocks/data';
import { normalizeResponse } from './utils';

describe('normalizeResponse', () => {
  it('should normalize a listing', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockListing = {
      ...emptyAuction,
      bids: [
        {
          id: '1',
          amount: 10,
          created: '',
          bidderName: 'bidder1',
        },
        {
          id: '2',
          amount: 20,
          created: '',
          bidderName: 'bidder2',
        },
      ],
      endsAt: yesterday.toISOString(),
    };
    const normalizedListing = normalizeResponse(mockListing);
    expect(normalizedListing).toEqual({
      ...mockListing,
      bids: [
        {
          id: '2',
          amount: 20,
          created: '',
          bidderName: 'bidder2',
        },
        {
          id: '1',
          amount: 10,
          created: '',
          bidderName: 'bidder1',
        },
      ],
      currentBid: 20,
      active: false,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockListing2 = {
      ...emptyAuction,
      bids: [
        {
          id: '1',
          amount: 10,
          created: '',
          bidderName: 'bidder1',
        },
        {
          id: '2',
          amount: 20,
          created: '',
          bidderName: 'bidder2',
        },
      ],
      endsAt: tomorrow.toISOString(),
    };

    const normalizedListing2 = normalizeResponse(mockListing2);
    expect(normalizedListing2).toEqual({
      ...mockListing2,
      bids: [
        {
          id: '2',
          amount: 20,
          created: '',
          bidderName: 'bidder2',
        },
        {
          id: '1',
          amount: 10,
          created: '',
          bidderName: 'bidder1',
        },
      ],
      currentBid: 20,
      active: true,
    });
  });
});
