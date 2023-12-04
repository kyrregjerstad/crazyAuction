/* 
based on https://github.com/mattpocock/zod-fetch
*/

export type Schema<TData> = {
  parse: (data: unknown) => TData;
};

export type ZodFetcher = <TData>(
  schema: Schema<TData>,
  ...args: Parameters<typeof fetch>
) => Promise<TData>;

const defaultFetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) {
    try {
      const data = await response.json();
      return Promise.reject(data);
    } catch (error) {
      throw new Error(response.statusText);
    }
  }

  return response.json();
};

export const createZodFetcher = (): ZodFetcher => {
  return async <TData>(
    schema: Schema<TData>,
    ...args: Parameters<typeof fetch>
  ): Promise<TData> => {
    const response = await defaultFetcher(...args);
    return schema.parse(response);
  };
};
