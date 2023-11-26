import { useToast } from '@/components/ui/use-toast';
import { Register, registerSchema } from '@/lib/schemas/register';
import { postRegisterUser } from '@/lib/services/postSignUp';
import { wait } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';

const useRegisterForm = () => {
  const { toast } = useToast();
  const { reward } = useReward('confetti', 'confetti');

  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      avatar: '',
    }, // set default values to empty strings to avoid uncontrolled to controlled error
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Register> = async (data) => {
    try {
      const res = await postRegisterUser(data);

      if (!res) throw new Error('Something went wrong');
      if ('errors' in res) {
        toast({
          title: 'Error',
          description: res.errors.map((error) => error.message).join(' '),
          variant: 'error',
          duration: 7000,
        });
        form.setError('root', {
          type: 'manual',
          message: res.errors.map((error) => error.message).join(' '),
        });
        return;
      }

      toast({
        title: 'Account created 🎉',
        description: "Ready for some crazy auctions? Let's go!",
        variant: 'success',
        duration: 5000,
      });
      reward();

      await wait(3000); // wait for toast and confetti to finish :)

      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const registerUser = handleSubmit(onSubmit);

  return { form, registerUser };
};

export default useRegisterForm;
