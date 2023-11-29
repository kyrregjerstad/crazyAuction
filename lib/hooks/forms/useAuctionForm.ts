import { useToast } from '@/components/ui/use-toast';
import emoji from '@/lib/emoji';
import { ListingFull } from '@/lib/schemas/listing';
import postListing, {
  AuctionFormComplete,
  auctionFormSchemaComplete,
} from '@/lib/services/postListing';
import updateAuction from '@/lib/services/updateListing';
import { wait } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';

type Params = {
  mode: 'create' | 'edit';
  listing: ListingFull | null;
};

const useAuctionForm = ({ mode = 'create', listing }: Params) => {
  const router = useRouter();
  const { toast } = useToast();
  const { reward } = useReward('reward', 'emoji', {
    emoji: emoji,
    elementCount: 50,
    lifetime: 2000,
  });
  const session = useSession();

  const form = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormSchemaComplete),
    defaultValues: {
      title: listing?.title ?? '',
      description: listing?.description ?? '',
      images: undefined,
      imageUrls: listing?.media ?? [],
      tags: listing?.tags.join(', ') ?? '',
      date: new Date(),
      time: new Date().toLocaleTimeString().slice(0, -3), // remove seconds
    }, // set default values to empty strings to avoid uncontrolled to controlled error
  });

  const { handleSubmit } = form;

  const onCreate: SubmitHandler<AuctionFormComplete> = async (data) => {
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

  const onEdit: SubmitHandler<AuctionFormComplete> = async (data) => {
    try {
      const res = await updateAuction({
        formData: data,
        id: listing!.id,
        jwt: session.data!.user.accessToken,
      });

      if (!res) throw new Error('Something went wrong');

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

  const postAuction = handleSubmit(mode === 'create' ? onCreate : onEdit);

  return { form, postAuction };
};

export default useAuctionForm;
