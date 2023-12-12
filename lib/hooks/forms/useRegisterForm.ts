import { useToast } from '@/components/ui/use-toast';
import { Register, registerSchema } from '@/lib/schemas/registerSchema';
import { postRegisterUser } from '@/lib/services/postSignUp';
import { wait } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';

type APIError = {
  message: string;
};

type APIResponse = {
  errors: APIError[];
  status: string;
  statusCode: number;
};

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

  const { handleSubmit, setError } = form;

  const onSubmit: SubmitHandler<Register> = async (data) => {
    try {
      await postRegisterUser(data);

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
    } catch (error: any) {
      console.error(error);

      if (error.errors) {
        const apiResponse: APIResponse = error;
        if (apiResponse) {
          apiResponse.errors.forEach((err) => {
            setError('root', { message: err.message });
          });
        }
      } else {
        setError('root', {
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  const registerUser = handleSubmit(onSubmit);

  return { form, registerUser };
};

export default useRegisterForm;
