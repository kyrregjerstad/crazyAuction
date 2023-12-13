import {
  postRegisterUser,
  type RegisterResponseError,
} from './postRegisterUser';
import { RegisterForm, registerResponseSchema } from '@/lib/schemas';
import * as auctionAPIFetcherModule from './auctionAPIFetcher';
import { Mock } from 'vitest';

vi.mock('./auctionAPIFetcher', () => ({
  default: vi.fn(),
}));

describe('postRegisterUser', () => {
  const mockRegisterForm: RegisterForm = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    repeatPassword: 'password123',
    avatar: 'avatar.jpg',
  };

  it('should call auctionAPIFetcher with correct parameters', async () => {
    const expectedBody = {
      name: mockRegisterForm.name,
      email: mockRegisterForm.email,
      password: mockRegisterForm.password,
      avatar: mockRegisterForm.avatar,
    };

    await postRegisterUser(mockRegisterForm);

    expect(auctionAPIFetcherModule.default).toHaveBeenCalledWith({
      endpoint: '/auth/register',
      schema: registerResponseSchema,
      method: 'POST',
      body: expectedBody,
    });
  });

  it('should return response data on successful registration', async () => {
    const mockResponse = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };
    (auctionAPIFetcherModule.default as Mock).mockResolvedValue(mockResponse);

    const response = await postRegisterUser(mockRegisterForm);

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if registration fails', async () => {
    const mockErrorResponse: RegisterResponseError = {
      errors: [{ message: 'Registration failed' }],
      status: 'error',
      statusCode: 400,
    };
    (auctionAPIFetcherModule.default as Mock).mockRejectedValue(
      mockErrorResponse,
    );

    await expect(postRegisterUser(mockRegisterForm)).rejects.toEqual(
      mockErrorResponse,
    );
  });
});
