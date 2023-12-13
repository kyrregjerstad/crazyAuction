import { useToast } from '@/components/ui/use-toast';
import { ContactForm, contactSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const useContactForm = () => {
  const router = useRouter();
  const session = useSession();
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: session.data?.user.name ?? '',
      subject: '',
      email: session.data?.user.email ?? '',
      message: '',
    },
  });

  const { toast } = useToast();

  const { setError, handleSubmit } = form;

  const onSubmit: SubmitHandler<ContactForm> = async ({
    name,
    email,
    subject,
    message,
  }) => {
    try {
      toast({
        title: 'Message Received ✅',
        description: `We'll get right back at you!`,
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again',
      });
      console.log(error);
    }
  };

  const handleLogin = handleSubmit(onSubmit);

  return { form, handleLogin };
};

export default useContactForm;
