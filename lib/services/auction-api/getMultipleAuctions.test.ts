import { getMultipleAuctions } from './getMultipleAuctions';
import * as getSingleAuctionModule from './getSingleAuction';
import { Mock } from 'vitest';

vi.mock('./getSingleAuction', () => ({
  getSingleAuction: vi.fn(),
}));

describe('getMultipleAuctions', () => {
  it('should fetch multiple auctions', async () => {
    const mockIds = ['id1', 'id2', 'id3'];
    const mockListings = [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }];
    (getSingleAuctionModule.getSingleAuction as Mock)
      .mockResolvedValueOnce(mockListings[0])
      .mockResolvedValueOnce(mockListings[1])
      .mockResolvedValueOnce(mockListings[2]);

    const results = await getMultipleAuctions(mockIds);

    expect(results).toEqual(mockListings);
    expect(getSingleAuctionModule.getSingleAuction).toHaveBeenCalledTimes(
      mockIds.length,
    );
    mockIds.forEach((id, index) => {
      expect(getSingleAuctionModule.getSingleAuction).toHaveBeenNthCalledWith(
        index + 1,
        id,
      );
    });
  });

  it('should filter out null results if an auction fails to fetch', async () => {
    const mockIds = ['id1', 'id2', 'id3'];
    (getSingleAuctionModule.getSingleAuction as Mock)
      .mockResolvedValueOnce({ id: 'id1' })
      .mockRejectedValueOnce(new Error('Fetch failed'))
      .mockResolvedValueOnce({ id: 'id3' });

    const results = await getMultipleAuctions(mockIds);

    expect(results).toEqual([{ id: 'id1' }, { id: 'id3' }]);
  });
});
