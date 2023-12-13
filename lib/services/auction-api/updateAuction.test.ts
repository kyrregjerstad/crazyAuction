import { singleAuctionSchema, UpdateAuctionForm } from '@/lib/schemas';
import { getSession } from 'next-auth/react';
import { Mock } from 'vitest';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { updateAuction } from './updateAuction';

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
}));

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

vi.mock('@/lib/schemas', () => ({
  singleAuctionSchema: {},
}));

describe('updateAuction', () => {
  const mockAuctionFormData: UpdateAuctionForm = {
    title: 'Test Title',
    description: 'Test Description',
    imageUrls: ['image1.jpg', 'image2.jpg'],
    tags: ['tag1', 'tag2'],
  };

  const mockJwt = 'mockJwtToken';
  const mockId = 'mockAuctionId';

  beforeAll(() => {
    (getSession as Mock).mockResolvedValue({ user: { accessToken: mockJwt } });
  });

  it('should call auctionAPIFetcher with correct parameters', async () => {
    const transformedMediaLinks = mockAuctionFormData.imageUrls?.map(
      (url) => `${process.env.NEXT_PUBLIC_WORKER_URL}/cache/${url}`,
    );

    await updateAuction({ formData: mockAuctionFormData, id: mockId });

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: `/listings/${mockId}`,
      schema: singleAuctionSchema,
      jwt: mockJwt,
      method: 'PUT',
      body: {
        title: mockAuctionFormData.title,
        description: mockAuctionFormData.description,
        media: transformedMediaLinks,
        tags: mockAuctionFormData.tags,
      },
    });
  });

  it('should throw an error if auctionAPIFetcher fails', async () => {
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(
      new Error('API fetch error'),
    );

    await expect(
      updateAuction({ formData: mockAuctionFormData, id: mockId }),
    ).rejects.toThrow('API fetch error');
  });

  it('should return the result of auctionAPIFetcher', async () => {
    const mockResponse = { id: mockId, title: mockAuctionFormData.title };

    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const res = await updateAuction({
      formData: mockAuctionFormData,
      id: mockId,
    });

    expect(res).toEqual(mockResponse);
  });
});
