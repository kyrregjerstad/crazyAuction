import { createZodFetcher } from './zodFetcher';

describe('createZodFetcher', () => {
  const mockSchema = {
    parse: vi.fn((data) => data),
  };

  it('should fetch and parse data successfully', async () => {
    const mockData = { key: 'value' };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    ) as any;

    const fetcher = createZodFetcher();
    const result = await fetcher(mockSchema, 'http://example.com');

    expect(result).toEqual(mockData);
    expect(mockSchema.parse).toHaveBeenCalledWith(mockData);
  });

  it('should handle non-OK response with JSON error message', async () => {
    const errorMessage = { error: 'Failed' };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve(errorMessage),
      }),
    ) as any;

    const fetcher = createZodFetcher();

    await expect(fetcher(mockSchema, 'http://example.com')).rejects.toEqual(
      errorMessage,
    );
  });

  it('should throw an error if non-OK response is not JSON parseable', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Error',
        json: () => Promise.reject(),
      }),
    ) as any;

    const fetcher = createZodFetcher();

    await expect(fetcher(mockSchema, 'http://example.com')).rejects.toThrow(
      'Error',
    );
  });

  it('should throw an error if parsing fails', async () => {
    const mockData = { key: 'value' };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    ) as any;

    const mockSchema = {
      parse: vi.fn(() => {
        throw new Error('Parsing failed');
      }),
    };

    const fetcher = createZodFetcher();

    await expect(fetcher(mockSchema, 'http://example.com')).rejects.toThrow(
      'Parsing failed',
    );
  });
});
