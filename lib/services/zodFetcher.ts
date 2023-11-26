/* 
based on https://github.com/mattpocock/zod-fetch
*/

export type AnyFetcher = (...args: any[]) => any;

export type Schema<TData> = {
  parse: (data: unknown) => TData;
};

export type ZodFetcher<TFetcher extends AnyFetcher> = <TData>(
  schema: Schema<TData>,
  ...args: Parameters<TFetcher>
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

export function createZodFetcher(
  fetcher: AnyFetcher = defaultFetcher,
): ZodFetcher<any> {
  return async (schema, ...args) => {
    const response = await fetcher(...args);
    return schema.parse(response);
  };
}
