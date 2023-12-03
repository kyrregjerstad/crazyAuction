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
import { FormEvent, use } from 'react';

type Step = 'info' | 'media' | 'dateTime' | 'summary';

const useInitializeForm = <T extends FieldValues>(
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
  step: Step;
};
const useMultiStepAuctionForm = ({
  mode = 'create',
  listing,
  step,
}: Params) => {
  const { getStore, updateStore, storedData, clearStore } =
    useAuctionFormStore();

  const { nextStep, prevStep } = useAuctionFormStep();

  const forms = {
    info: useInitializeForm<AuctionFormInfo>(auctionFormInfoSchema, {
      title: listing?.title ?? storedData.title ?? '',
      description: listing?.description ?? storedData.description ?? '',
    }),
    media: useInitializeForm<AuctionFormMedia>(auctionFormMediaSchema, {
      images: storedData.images ?? [],
      imageUrls: storedData.imageUrls ?? [],
    }),
    dateTime: useInitializeForm<AuctionFormDate>(auctionFormDateSchema, {
      dateTime: storedData.dateTime ?? undefined,
    }),
    summary: useInitializeForm<AuctionFormComplete>(auctionFormSchemaComplete, {
      title: listing?.title ?? storedData.title ?? '',
      description: listing?.description ?? storedData.description ?? '',
      images: storedData.images ?? [],
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
    const { title, description, imageUrls, dateTime } = data;

    const auctionData = {
      title,
      description,
      media: imageUrls,
      endsAt: dateTime,
    };
    clearStore();
  };

  const formHandlers = {
    info: forms.info.handleSubmit(onSaveStep),
    media: forms.media.handleSubmit(onSaveStep),
    dateTime: forms.dateTime.handleSubmit(onSaveStep),
    summary: forms.summary.handleSubmit(onSaveSummaryStep),
  };

  const saveStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const handleFormSubmit = formHandlers[step];
    if (handleFormSubmit) {
      await handleFormSubmit();
    }
  };

  return { ...forms, saveStep };
};

export default useMultiStepAuctionForm;
