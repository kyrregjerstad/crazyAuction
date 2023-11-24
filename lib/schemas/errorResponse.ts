import { z } from 'zod';

const errorResponseSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
  status: z.string(),
  statusCode: z.number(),
});

const error = {
  errors: [
    {
      message: 'Profile already exists',
    },
  ],
  status: 'Bad Request',
  statusCode: 400,
};
