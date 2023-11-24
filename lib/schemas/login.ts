import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) => {
        return (
          email.endsWith('@noroff.no') || email.endsWith('@stud.noroff.no')
        );
      },
      {
        message: 'Email must end with @noroff.no or @stud.noroff.no',
      },
    ),
  password: z.string().min(8),
});

export type Login = z.infer<typeof loginSchema>;
