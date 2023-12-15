import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) =>
        email.endsWith('@stud.noroff.no') || email.endsWith('@noroff.no'),

      {
        message: 'Email must end with @noroff.no or @stud.noroff.no',
      },
    ),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export type LoginForm = z.infer<typeof loginSchema>;
