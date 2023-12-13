import { postBid } from './postBid';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { Mock } from 'vitest';
import { singleAuctionSchema } from '@/lib/schemas';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('postBid', () => {
  const mockListingId = 'mockListingId';
  const mockAmount = 100;
  const mockJwt = 'mockJwtToken';

  it('should call auctionAPIFetcher with correct parameters', async () => {
    await postBid({
      listingId: mockListingId,
      amount: mockAmount,
      jwt: mockJwt,
    });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: `/listings/${mockListingId}/bids`,
      schema: singleAuctionSchema,
      jwt: mockJwt,
      method: 'POST',
      body: {
        amount: mockAmount,
      },
    });
  });

  it('should return response data on successful bid submission', async () => {
    const mockResponse = { success: true, message: 'Bid placed successfully' };
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await postBid({
      listingId: mockListingId,
      amount: mockAmount,
      jwt: mockJwt,
    });

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if bid submission fails', async () => {
    const mockError = new Error('Bid submission failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(
      postBid({ listingId: mockListingId, amount: mockAmount, jwt: mockJwt }),
    ).rejects.toThrow('Bid submission failed');
  });
});
