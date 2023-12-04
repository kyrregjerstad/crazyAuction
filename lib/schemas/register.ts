import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^[A-Za-z0-9_]+$/,
        'Name must not contain punctuation symbols apart from underscore (_).',
      )
      .min(1, 'Name is required.')
      .max(20, 'Name must be less than 20 characters.'),
    email: z
      .string()
      .email('Invalid email format.')
      .refine((email) => email.endsWith('@stud.noroff.no'), {
        message: 'Email must be a valid stud.noroff.no email address.',
      }),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    repeatPassword: z.string(),
    avatar: z
      .string()
      .refine(
        (data) => data === '' || z.string().url().safeParse(data).success,
        {
          message: 'Avatar must be empty or a valid URL.',
        },
      ),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match.",
    path: ['repeatPassword'],
  });

export const registerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string(), // Always present, can be an empty string
  credits: z.number(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export type Register = z.infer<typeof registerSchema>;
