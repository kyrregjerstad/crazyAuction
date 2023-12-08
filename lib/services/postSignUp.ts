import {
  Register,
  RegisterResponse,
  registerResponseSchema,
} from '../schemas/registerSchema';
import auctionAPIFetcher from './auctionAPIFetcher';

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
    const res = await auctionAPIFetcher({
      endpoint: `/auth/register`,
      schema: registerResponseSchema,
      method: 'POST',
      body: transformedParams,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
