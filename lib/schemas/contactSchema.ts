import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1).max(50),
  subject: z.string().min(1).max(50),
  email: z.string().email(),
  message: z.string().min(1).max(50),
});

export type ContactForm = z.infer<typeof contactSchema>;
