import { getSingleAuction } from './getSingleAuction';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { singleAuctionSchemaExtended } from '@/lib/schemas';
import { Mock } from 'vitest';

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

  it('should return auction data with sorted bids on successful fetch', async () => {
    const mockResponse = {
      id: mockId,
      bids: [{ amount: 100 }, { amount: 200 }, { amount: 150 }],
    };
    const sortedBids = [...mockResponse.bids].sort(
      (a, b) => b.amount - a.amount,
    );

    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await getSingleAuction(mockId);

    expect(response).toEqual({ ...mockResponse, bids: sortedBids });
  });

  it('should throw an error if fetching auction data fails', async () => {
    const mockError = new Error('Auction fetch failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(getSingleAuction(mockId)).rejects.toThrow(
      'Auction fetch failed',
    );
  });
});
