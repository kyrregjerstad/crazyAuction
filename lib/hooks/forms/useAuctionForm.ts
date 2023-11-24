import { useToast } from '@/components/ui/use-toast';
import { Register, registerSchema } from '@/lib/schemas/register';
import { postRegisterUser } from '@/lib/services/postSignUp';
import { wait } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';
import postListing, {
  AuctionForm,
  auctionFormSchema,
} from '@/lib/services/postListing';
import { useRouter } from 'next/navigation';
import emoji from '@/lib/emoji';

const useAuctionForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { reward } = useReward('reward', 'emoji', {
    emoji: emoji,
    elementCount: 50,
    lifetime: 2000,
  });
  const session = useSession();

  const form = useForm<AuctionForm>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      images: undefined,
      imageUrls: [],
      tags: '',
      date: new Date(),
      time: new Date().toLocaleTimeString().slice(0, -3), // remove seconds
    }, // set default values to empty strings to avoid uncontrolled to controlled error
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<AuctionForm> = async (data) => {
    try {
      const res = await postListing({
        formData: data,
        jwt: session.data!.user.accessToken,
      });

      if (!res) throw new Error('Something went wrong');

      reward();

      await wait(1000);
      router.push(`/item/${res.id}`);
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

  const postAuction = handleSubmit(onSubmit);

  return { form, postAuction };
};

export default useAuctionForm;
