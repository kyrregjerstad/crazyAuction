import { useToast } from '@/components/ui/use-toast';
import { updateAvatar } from '@/lib/services/auction-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

const updateAvatarSchema = z.object({
  avatar: z.string().url(),
});

type Avatar = z.infer<typeof updateAvatarSchema>;

const useUpdateAvatarForm = () => {
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const { data } = session;

  const form = useForm<Avatar>({
    resolver: zodResolver(updateAvatarSchema),
    defaultValues: {
      avatar: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Avatar> = async ({ avatar }) => {
    if (!data?.user?.accessToken) return;
    try {
      const res = await updateAvatar({
        avatar,
        name: data.user.name,
        jwt: data.user.accessToken,
      });

      if (!res) throw new Error('Something went wrong');

      toast({
        title: 'Looking good 😎',
        description: 'Your avatar has been updated!',
        variant: 'success',
        duration: 5000,
      });
      router.refresh();
      session.data.user.avatar = avatar;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'error',
        duration: 5000,
      });
    }
  };

  const handleUpdateAvatar = handleSubmit(onSubmit);

  return { form, handleUpdateAvatar };
};

export default useUpdateAvatarForm;
