import { createZodFetcher } from './zodFetcher';
import { API_REGISTER_URL } from '../constants';
import {
  Register,
  RegisterResponse,
  registerResponseSchema,
} from '../schemas/register';

const fetchWithZod = createZodFetcher();

type RegisterResponseError = {
  errors: [
    {
      message: string;
    },
  ];
  status: string;
  statusCode: number;
};

export const postRegisterUser = async (
  params: Register,
): Promise<RegisterResponse | RegisterResponseError> => {
  const transformedParams = {
    name: params.name,
    email: params.email,
    password: params.password,
    avatar: params.avatar,
  }; // remove the repeatPassword field

  try {
    return await fetchWithZod(registerResponseSchema, API_REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformedParams),
    });
  } catch (error) {
    return error as RegisterResponseError;
  }
};
