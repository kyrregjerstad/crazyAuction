import { z } from 'zod';

export interface FetcherArgs<TSchema extends z.ZodType<any, any>> {
  url: string;
  options?: RequestInit;
  schema: TSchema;
}

export class FetchError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}

export async function fetcher<TSchema extends z.ZodType<any, any>>({
  url,
  options,
  schema,
}: FetcherArgs<TSchema>): Promise<z.infer<TSchema> | unknown> {
  const response = await fetch(url, { ...options });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore and use default error message
    }
    throw new FetchError(response.status, errorMessage);
  }

  let data = await response.json();

  const validation = schema.safeParse(data);
  if (!validation.success) {
    throw new Error(
      validation.error.issues.map((issue) => issue.message).join('\n'),
    );
  }

  return validation.data;
}
