import { z } from 'zod';

type ValidationSchema<T> = z.ZodSchema<T> | undefined;

type FetcherArgs<T> = {
  url: string;
  options?: RequestInit;
  schema?: ValidationSchema<T>;
};

export async function fetcher<T>({ url, options, schema }: FetcherArgs<T>) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (!schema) {
      return data as T;
    }

    const validation = schema.safeParse(data);

    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    return data as T;
  } catch (error) {
    console.error(error);
  }
}
