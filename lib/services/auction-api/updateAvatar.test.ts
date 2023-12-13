import { updateAvatar } from './updateAvatar';
import { updateAvatarSchema } from '@/lib/schemas';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { Mock } from 'vitest';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('updateAvatar', () => {
  const mockName = 'testUser';
  const mockAvatar = 'https://test.com/avatar.png';
  const mockJwt = 'testJwtToken';

  vi.mock('@/lib/schemas', () => ({
    updateAvatarSchema: {},
  }));

  it('should call auctionAPIFetcher with correct parameters', async () => {
    await updateAvatar({ name: mockName, avatar: mockAvatar, jwt: mockJwt });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: `/profiles/${mockName}/media`,
      schema: updateAvatarSchema,
      jwt: mockJwt,
      method: 'PUT',
      body: {
        avatar: mockAvatar,
      },
    });
  });

  it('should return response data on successful avatar update', async () => {
    const mockResponse = {
      success: true,
      message: 'Avatar updated successfully',
    };
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await updateAvatar({
      name: mockName,
      avatar: mockAvatar,
      jwt: mockJwt,
    });

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if avatar update fails', async () => {
    const mockError = new Error('Avatar update failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(
      updateAvatar({ name: mockName, avatar: mockAvatar, jwt: mockJwt }),
    ).rejects.toThrow('Avatar update failed');
  });
});
