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
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import useAuctionFormStep from '../useAuctionFormStep';
import useAuctionFormStore from '../useAuctionFormStore';
import { ZodSchema } from 'zod';
import { FormEvent } from 'react';
import usePostListing from '@/lib/services/usePostListing';
import { useRouter } from 'next/navigation';

export const useInitializeForm = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues?: DefaultValues<T>,
): UseFormReturn<T> => {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
};

type Params = {
  mode: 'create' | 'edit';
  listing: ListingFull | null;
};
const useMultiStepAuctionForm = ({ mode = 'create', listing }: Params) => {
  const { getStore, updateStore, storedData, clearStore } =
    useAuctionFormStore();

  const { nextStep, getCurrentStep } = useAuctionFormStep();
  const { postListing } = usePostListing();
  const router = useRouter();
  const currentStep = getCurrentStep();

  const forms = {
    info: useInitializeForm<AuctionFormInfo>(auctionFormInfoSchema, {
      title: listing?.title ?? storedData.title ?? '',
      description: listing?.description ?? storedData.description ?? '',
    }),
    media: useInitializeForm<AuctionFormMedia>(auctionFormMediaSchema, {
      imageUrls: storedData.imageUrls ?? [],
    }),
    dateTime: useInitializeForm<AuctionFormDate>(auctionFormDateSchema, {
      dateTime: storedData.dateTime ?? undefined,
    }),
    summary: useInitializeForm<AuctionFormComplete>(auctionFormSchemaComplete, {
      title: listing?.title ?? storedData.title ?? '',
      description: listing?.description ?? storedData.description ?? '',
      imageUrls: storedData.imageUrls ?? [],
      dateTime: storedData.dateTime ?? undefined,
    }),
  };

  const onSaveStep: SubmitHandler<any> = async (data) => {
    updateStore(data);
    nextStep();
  };

  const onSaveSummaryStep = async () => {
    const data = getStore();
    const { title, description, imageUrls, dateTime, tags } = data;

    const auctionData = {
      title,
      description,
      tags,
      imageUrls,
      dateTime: dateTime,
    };

    try {
      const res = await postListing({ formData: auctionData });
      clearStore();
      router.push(`/auctions/${res?.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const formHandlers = {
    info: forms.info.handleSubmit(onSaveStep),
    media: forms.media.handleSubmit(onSaveStep),
    time: forms.dateTime.handleSubmit(onSaveStep),
    summary: forms.summary.handleSubmit(onSaveSummaryStep),
  };

  const saveStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const handleFormSubmit = formHandlers[currentStep];
    if (handleFormSubmit) {
      await handleFormSubmit();
    }
  };

  return { ...forms, saveStep };
};

export default useMultiStepAuctionForm;
