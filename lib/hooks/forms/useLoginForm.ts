import { Login, loginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

const useLoginForm = () => {
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError, handleSubmit } = form;

  const onSubmit: SubmitHandler<Login> = async ({ email, password }) => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!res) {
        setError('root', {
          type: 'manual',
          message: 'No response',
        });
        throw new Error('No response');
      }

      if (!res.ok) {
        setError('root', {
          type: 'server',
          message: 'Email and password combination not found',
        });
        throw new Error('Response not ok');
      }

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = handleSubmit(onSubmit);

  return { form, handleLogin };
};

export default useLoginForm;
