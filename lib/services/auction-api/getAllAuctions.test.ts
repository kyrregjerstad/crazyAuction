import { emptyAuction } from '@/lib/mocks/data';
import { AuctionFull } from '@/lib/schemas';
import { MockedFunction } from 'vitest';
import { fetchAllAuctions, getAllAuctions } from './getAllAuctions';
import { getAuctions } from './getAuctions';

vi.mock('./getAuctions', () => ({
  getAuctions: vi.fn(),
}));

const mockedGetAuctions = getAuctions as MockedFunction<typeof getAuctions>;

describe('fetchAllAuctions and getAllAuctions', () => {
  const mockAuctionsPage1: AuctionFull[] = new Array(100)
    .fill({})
    .map((_, index) => ({ ...emptyAuction, id: `auction${index + 1}` }));
  const mockAuctionsPage2: AuctionFull[] = [
    { ...emptyAuction, id: 'auction101' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch all auctions in multiple pages', async () => {
    mockedGetAuctions
      .mockResolvedValueOnce(mockAuctionsPage1)
      .mockResolvedValueOnce(mockAuctionsPage2);

    const allAuctions = await fetchAllAuctions({});

    expect(allAuctions).toEqual([...mockAuctionsPage1, ...mockAuctionsPage2]);
    expect(getAuctions).toHaveBeenCalledTimes(2);
    expect(getAuctions).toHaveBeenCalledWith({
      sort: 'created',
      sortOrder: 'desc',
      limit: 100,
      offset: 0,
    });
    expect(getAuctions).toHaveBeenCalledWith({
      sort: 'created',
      sortOrder: 'desc',
      limit: 100,
      offset: 100,
    });
  });

  it('should fetch a single page of auctions if less than limit', async () => {
    mockedGetAuctions.mockResolvedValueOnce(mockAuctionsPage2);

    const allAuctions = await fetchAllAuctions({});

    expect(allAuctions).toEqual(mockAuctionsPage2);
    expect(getAuctions).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if getAuctions fails', async () => {
    const mockError = new Error('Fetch failed');
    mockedGetAuctions.mockRejectedValue(mockError);

    await expect(fetchAllAuctions({})).rejects.toThrow('Fetch failed');
  });

  it('should call fetchAllAuctions when getAllAuctions is called', async () => {
    mockedGetAuctions
      .mockResolvedValueOnce(mockAuctionsPage1)
      .mockResolvedValueOnce(mockAuctionsPage2);

    const allAuctions = await getAllAuctions({});

    expect(allAuctions).toEqual([...mockAuctionsPage1, ...mockAuctionsPage2]);
  });

  // Additional tests...
});
