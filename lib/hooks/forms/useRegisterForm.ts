import { SubmitHandler, useForm } from 'react-hook-form';
import { Register, registerSchema } from '@/lib/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { postRegisterUser } from '@/lib/services/postSignUp';
import { signIn } from 'next-auth/react';
import { wait } from '@/lib/utils';

const useRegisterForm = () => {
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
