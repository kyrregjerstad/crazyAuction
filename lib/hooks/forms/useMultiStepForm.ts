import { useToast } from '@/components/ui/use-toast';
import emoji from '@/lib/emoji';
import { ListingFull } from '@/lib/schemas/listing';
import postListing, {
  AuctionFormComplete,
  AuctionFormDate,
  AuctionFormInfo,
  AuctionFormMedia,
  auctionFormDateSchema,
  auctionFormInfoSchema,
  auctionFormMediaSchema,
  auctionFormSchemaComplete,
} from '@/lib/services/postListing';
import updateAuction from '@/lib/services/updateListing';
import { wait } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';
import useAuctionFormStore from '../useAuctionFormStore';
import { on } from 'events';

type Step = 'info' | 'media' | 'time' | 'summary';

type Params = {
  mode: 'create' | 'edit';
  listing: ListingFull | null;
  step: Step;
  nextStep: Step;
};

const useMultiStepAuctionForm = ({
  mode = 'create',
  listing,
  step,
  nextStep,
}: Params) => {
  const router = useRouter();
  const { toast } = useToast();

  const session = useSession();

  const { setStore, getStore, clearStore } = useAuctionFormStore();

  const infoForm = useForm<AuctionFormInfo>({
    resolver: zodResolver(auctionFormInfoSchema),
    defaultValues: {
      title: listing?.title ?? '',
      description: listing?.description ?? '',
    },
  });

  const mediaForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormMediaSchema),
    defaultValues: {
      images: undefined,
      imageUrls: listing?.media ?? [],
    },
  });

  const timeForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormDateSchema),
    defaultValues: {
      date: listing?.endsAt ? new Date(listing.endsAt) : new Date(),
      time: listing?.endsAt
        ? new Date(listing.endsAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
    },
  });

  const summaryForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormSchemaComplete),
  });

  const { handleSubmit: handleSubmitInfo } = infoForm;
  const { handleSubmit: handleSubmitMedia } = mediaForm;
  const { handleSubmit: handleSubmitTime } = timeForm;
  const { handleSubmit: handleSubmitSummary } = summaryForm;

  const onSaveStep: SubmitHandler<AuctionFormInfo> = async (data) => {
    console.log('object');
    const newState = {
      ...getStore(),
      ...data,
    };
    setStore(newState);
    router.push(`?step=${nextStep}`);
  };

  const onSaveMediaStep: SubmitHandler<AuctionFormMedia> = async (data) => {
    const newState = {
      ...getStore(),
      ...data,
    };
    setStore(newState);
    router.push(`?step=${nextStep}`);
  };

  const onSaveTimeStep: SubmitHandler<AuctionFormDate> = async (data) => {
    const newState = {
      ...getStore(),
      ...data,
    };
    setStore(newState);
    router.push(`?step=${nextStep}`);
  };

  const onSaveSummaryStep = async () => {
    const data = getStore();
    const { title, description, images, imageUrls, date, time } = data;

    const endsAt = new Date(date);
    const timeArr = time.split(':');
    endsAt.setHours(Number(timeArr[0]));
    endsAt.setMinutes(Number(timeArr[1]));

    const auctionData = {
      title,
      description,
      media: images,
      endsAt: endsAt.toISOString(),
    };
  };

  const saveStep = async (e) => {
    e.preventDefault();
    switch (step) {
      case 'info':
        await handleSubmitInfo(onSaveStep)();
        break;
      case 'media':
        await handleSubmitMedia(onSaveMediaStep)();
        break;
      case 'time':
        await handleSubmitTime(onSaveTimeStep)();
        break;
      case 'summary':
        await handleSubmitSummary(onSaveSummaryStep)();
        break;
      default:
        break;
    }
  };

  return { infoForm, mediaForm, timeForm, summaryForm, saveStep };
};

export default useMultiStepAuctionForm;
