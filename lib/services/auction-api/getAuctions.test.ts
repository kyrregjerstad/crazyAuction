import { getAuctions } from './getAuctions';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { allAuctionsSchema } from '@/lib/schemas';
import { emptyBid, emptyAuction } from '../../mocks/data';
import { Mock } from 'vitest';

vi.mock('./auctionAPIFetcher', () => {
  return {
    default: vi.fn(),
  };
});

vi.mock('@/lib/schemas', () => {
  return {
    allAuctionsSchema: {},
  };
});

describe('getListings', () => {
  const mockFetchResponse = [
    {
      ...emptyAuction,
      id: '1',
      title: 'Listing 1',
      description: 'Description 1',
      bids: [
        { ...emptyBid, amount: 100 },
        { ...emptyBid, amount: 50 },
      ],
    },
  ];

  it('should fetch listings with default parameters', async () => {
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(
      mockFetchResponse,
    );

    const listings = await getAuctions({});

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/listings',
      schema: allAuctionsSchema,
      queryParams: {
        _seller: true,
        _bids: true,
        _active: true,
        sort: 'created',
        sortOrder: 'desc',
        limit: undefined,
        offset: undefined,
      },
    });

    expect(listings[0].bids[0].amount).toBe(100);
  });
});
