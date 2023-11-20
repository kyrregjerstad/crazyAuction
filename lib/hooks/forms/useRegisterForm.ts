import { SubmitHandler, useForm } from 'react-hook-form';
import { Register, registerSchema } from '@/lib/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';

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

  const onSubmit: SubmitHandler<Register> = (data) => {
    console.log(data);
    try {
      // postRegisterUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const registerUser = handleSubmit(onSubmit);

  return { form, registerUser };
};

export default useRegisterForm;
