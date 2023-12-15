import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import auctionAPIFetcher, { appendQueryParams } from './auctionAPIFetcher';

const mockSchema = z.object({
  key: z.string(),
});

vi.mock('@/lib/services/zodFetcher', () => {
  return {
    createZodFetcher: () =>
      vi.fn(() => Promise.resolve({ parsedData: 'mockData' })),
  };
});

describe('auctionAPIFetcher', () => {
  const mockID = '123';

  it('should fetch listings', async () => {
    const result = await auctionAPIFetcher({
      endpoint: '/listings',
      schema: mockSchema,
    });

    expect(result).toEqual({ parsedData: 'mockData' });
  });

  it('should fetch specific listing by ID', async () => {
    const result = await auctionAPIFetcher({
      endpoint: `/listings/${mockID}`,
      schema: mockSchema,
    });

    expect(result).toEqual({ parsedData: 'mockData' });
  });

  it('should register a user', async () => {
    const result = await auctionAPIFetcher({
      endpoint: '/auth/register',
      schema: mockSchema,
      method: 'POST',
      body: { username: 'newuser', password: 'password123' },
    });

    expect(result).toEqual({ parsedData: 'mockData' });
  });

  it('should login a user', async () => {
    const result = await auctionAPIFetcher({
      endpoint: '/auth/login',
      schema: mockSchema,
      method: 'POST',
      body: { username: 'user', password: 'pass' },
    });

    expect(result).toEqual({ parsedData: 'mockData' });
  });

  it('should update listing by ID', async () => {
    const result = await auctionAPIFetcher({
      endpoint: `/listings/${mockID}`,
      schema: mockSchema,
      method: 'PUT',
      body: { title: 'Updated Listing' },
    });

    expect(result).toEqual({ parsedData: 'mockData' });
  });
});

describe('appendQueryParams', () => {
  it('should append query params to a URL', () => {
    const url = new URL('https://example.com');
    appendQueryParams(url, { sort: 'created', sortOrder: 'desc' });

    expect(url.toString()).toEqual(
      'https://example.com/?sort=created&sortOrder=desc',
    );
  });
});
