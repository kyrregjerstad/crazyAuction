import { getAllUsers } from './getAllUsers';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { Mock } from 'vitest';
import { allUsersSchema } from '@/lib/schemas';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('getAllUsers', () => {
  const mockJwt = 'mockJwtToken';

  it('should call auctionAPIFetcher with correct default parameters', async () => {
    await getAllUsers({ jwt: mockJwt });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/profiles',
      schema: allUsersSchema,
      jwt: mockJwt,
      queryParams: {
        _listings: true,
        sort: 'credits',
        sortOrder: 'desc',
      },
    });
  });

  it('should call auctionAPIFetcher with custom parameters', async () => {
    const customSort = 'name';
    const customSortOrder = 'asc';

    await getAllUsers({
      sort: customSort,
      sortOrder: customSortOrder,
      jwt: mockJwt,
    });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/profiles',
      schema: allUsersSchema,
      jwt: mockJwt,
      queryParams: {
        _listings: true,
        sort: customSort,
        sortOrder: customSortOrder,
      },
    });
  });

  it('should return user data on successful fetch', async () => {
    const mockResponse = [
      { id: '1', name: 'User1' },
      { id: '2', name: 'User2' },
    ];
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await getAllUsers({ jwt: mockJwt });

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if fetching user data fails', async () => {
    const mockError = new Error('User data fetch failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(getAllUsers({ jwt: mockJwt })).rejects.toThrow(
      'User data fetch failed',
    );
  });
});
