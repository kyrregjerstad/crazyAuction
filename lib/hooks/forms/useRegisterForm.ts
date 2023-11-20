import { SubmitHandler, useForm } from 'react-hook-form';
import { Register, registerSchema } from '@/lib/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { postRegisterUser } from '@/lib/services/postSignUp';

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
    } catch (error) {
      console.error(error);
    }
  };

  const registerUser = handleSubmit(onSubmit);

  return { form, registerUser };
};

export default useRegisterForm;
