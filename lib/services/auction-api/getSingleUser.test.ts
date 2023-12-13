import { getSingleUser } from './getSingleUser';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { Mock } from 'vitest';
import { singleUserSchema } from '@/lib/schemas';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('getSingleUser', () => {
  const mockUsername = 'testUser';
  const mockJwt = 'mockJwtToken';

  it('should call auctionAPIFetcher with correct parameters', async () => {
    await getSingleUser({ username: mockUsername, jwt: mockJwt });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: `/profiles/${mockUsername}`,
      schema: singleUserSchema,
      jwt: mockJwt,
      queryParams: {
        _listings: true,
      },
    });
  });

  it('should return user data on successful fetch', async () => {
    const mockResponse = { id: '1', username: 'testUser', listings: [] };
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await getSingleUser({
      username: mockUsername,
      jwt: mockJwt,
    });

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if fetching user data fails', async () => {
    const mockError = new Error('User data fetch failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(
      getSingleUser({ username: mockUsername, jwt: mockJwt }),
    ).rejects.toThrow('User data fetch failed');
  });
});
