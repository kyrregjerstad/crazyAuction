import { useToast } from '@/components/ui/use-toast';
import { ListingFull } from '@/lib/schemas/listing';
import {
  AuctionFormComplete,
  AuctionFormDate,
  AuctionFormInfo,
  AuctionFormMedia,
  auctionFormDateSchema,
  auctionFormInfoSchema,
  auctionFormMediaSchema,
  auctionFormSchemaComplete,
} from '@/lib/services/postListing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuctionFormStore from '../useAuctionFormStore';

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

  const { getStore, updateStore, storedData, clearStore } =
    useAuctionFormStore();

  const infoForm = useForm<AuctionFormInfo>({
    resolver: zodResolver(auctionFormInfoSchema),
    defaultValues: {
      title: listing?.title ?? storedData.title ?? '',
      description: listing?.description ?? storedData.description ?? '',
    },
  });

  const mediaForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormMediaSchema),
    defaultValues: {
      images: undefined,
      imageUrls: listing?.media ?? storedData.imageUrls ?? [],
    },
  });

  const dateForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormDateSchema),
    defaultValues: {
      dateTime: storedData.dateTime
        ? new Date(storedData.dateTime)
        : new Date(),
    },
  });

  const summaryForm = useForm<AuctionFormComplete>({
    resolver: zodResolver(auctionFormSchemaComplete),
  });

  const { handleSubmit: handleSubmitInfo } = infoForm;
  const { handleSubmit: handleSubmitMedia } = mediaForm;
  const { handleSubmit: handleSubmitTime } = dateForm;
  const { handleSubmit: handleSubmitSummary } = summaryForm;

  const onSaveStep: SubmitHandler<AuctionFormInfo> = async (data) => {
    updateStore(data);
    router.push(`?step=${nextStep}`);
  };

  const onSaveMediaStep: SubmitHandler<AuctionFormMedia> = async (data) => {
    updateStore(data);
    router.push(`?step=${nextStep}`);
  };

  const onSaveTimeStep: SubmitHandler<AuctionFormDate> = async (data) => {
    updateStore(data);
    router.push(`?step=${nextStep}`);
  };

  const onSaveSummaryStep = async () => {
    const data = getStore();
    const { title, description, images, imageUrls, dateTime } = data;

    const auctionData = {
      title,
      description,
      media: images,
      endsAt: dateTime,
    };
  };

  // TODO: fix type
  const saveStep = async (e: any) => {
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

  return { infoForm, mediaForm, dateForm, summaryForm, saveStep };
};

export default useMultiStepAuctionForm;
