import { postAuction } from './postAuction';
import { AuctionFormComplete, singleAuctionSchema } from '@/lib/schemas';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { getSession } from 'next-auth/react';
import { Mock } from 'vitest';

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
}));

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('postAuction', () => {
  const mockFormData: AuctionFormComplete = {
    title: 'Test Auction',
    description: 'This is a test auction',
    imageUrls: ['image1.jpg', 'image2.jpg'],
    tags: ['Art', 'Vintage'],
    dateTime: new Date().toISOString(),
  };

  const mockJwt = 'mockJwtToken';

  beforeAll(() => {
    (getSession as Mock).mockResolvedValue({ user: { accessToken: mockJwt } });
  });

  it('should call auctionAPIFetcher with correct parameters', async () => {
    const transformedMediaLinks = mockFormData.imageUrls.map(
      (url) => `${process.env.NEXT_PUBLIC_WORKER_URL}/cache/${url}`,
    );

    await postAuction({ formData: mockFormData });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/listings',
      schema: singleAuctionSchema,
      method: 'POST',
      jwt: mockJwt,
      body: {
        title: mockFormData.title,
        description: mockFormData.description,
        media: transformedMediaLinks,
        tags: mockFormData.tags,
        endsAt: mockFormData.dateTime,
      },
    });
  });

  it('should return response data on successful auction posting', async () => {
    const mockResponse = { id: '1', title: 'Test Auction' };
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await postAuction({ formData: mockFormData });

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if auction posting fails', async () => {
    const mockError = new Error('Auction posting failed');
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(mockError);

    await expect(postAuction({ formData: mockFormData })).rejects.toThrow(
      'Auction posting failed',
    );
  });
});
