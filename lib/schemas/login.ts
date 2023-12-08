import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) => {
        return email.endsWith('@stud.noroff.no');
      },
      {
        message: 'Email must end with @stud.noroff.no',
      },
    ),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export type Login = z.infer<typeof loginSchema>;
