import { getSingleAuction } from './getSingleAuction';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { singleAuctionSchemaExtended } from '@/lib/schemas';
import { Mock } from 'vitest';
import { normalizeResponse } from './utils';
import { emptyAuction, emptyBid } from '@/lib/mocks/data';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('getSingleAuction', () => {
  const mockId = 'mockAuctionId';

  it('should call auctionAPIFetcher with correct parameters', async () => {
    await getSingleAuction(mockId);

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: `/listings/${mockId}`,
      schema: singleAuctionSchemaExtended,
      queryParams: {
        _bids: true,
        _seller: true,
      },
    });
  });

  it('should return auction data with normalized data on successful fetch', async () => {
    const mockResponse = {
      ...emptyAuction,
      id: mockId,
      bids: [
        { ...emptyBid, amount: 100 },
        { ...emptyBid, amount: 200 },
        { ...emptyBid, amount: 150 },
      ],
    };

    const normalizedData = normalizeResponse(mockResponse);

    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await getSingleAuction(mockId);

    expect(response).toEqual({ ...normalizedData });
  });

  it('should return null if fetching auction data fails', async () => {
    const mockError = new Error('Auction fetch failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(getSingleAuction(mockId)).resolves.toBeNull();
  });
});
