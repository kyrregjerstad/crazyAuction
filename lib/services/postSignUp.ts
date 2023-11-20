import { createZodFetcher } from 'zod-fetch';
import { API_REGISTER_URL } from '../constants';
import { Register, registerResponseSchema } from '../schemas/register';

const fetchWithZod = createZodFetcher();

export const postRegisterUser = async (params: Register) => {
  const body = JSON.stringify({
    ...params,
  });

  try {
    return await fetchWithZod(registerResponseSchema, API_REGISTER_URL, {
      method: 'POST',
      body,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
