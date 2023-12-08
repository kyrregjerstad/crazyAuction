import {
  type PostListing,
  type Step,
} from '@/components/new-auction-form/types';
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
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import {
  DefaultValues,
  FieldValues,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { ZodSchema } from 'zod';
import useAuctionFormStore from '../useAuctionFormStore';
import { wait } from '@/lib/utils';

const useFormInitialization = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues: DefaultValues<T>,
): UseFormReturn<T> => {
  return useForm({ resolver: zodResolver(schema), defaultValues });
};

type StepHandlersParams = {
  updateStore: (partialData: Partial<AuctionFormComplete>) => void;
  nextStep: () => void;
  postListing: (params: { formData: AuctionFormComplete }) => Promise<any>;
  clearStore: () => void;
  router: AppRouterInstance;
};

const useStepHandlers = ({
  updateStore,
  nextStep,
  postListing,
  clearStore,
  router,
}: StepHandlersParams) => {
  const onSaveStep = async (data: Partial<AuctionFormComplete>) => {
    console.log(data);

    updateStore(data);
    nextStep();
  };

  const onSaveSummaryStep = async (formData: AuctionFormComplete) => {
    const res = await postListing({ formData });
    router.push(`/item/${res?.id}`);
    clearStore();
  };

  return { onSaveStep, onSaveSummaryStep };
};

type Params = {
  mode?: 'create' | 'edit';
  listing: ListingFull | null;
  nextStep: () => void;
  postListing: PostListing;
  currentStep: Step;
};

const useMultiStepAuctionForm = ({
  mode = 'create',
  listing,
  nextStep,
  postListing,
  currentStep,
}: Params) => {
  const router = useRouter();
  const { updateStore, clearStore, storedData } = useAuctionFormStore();

  const forms = {
    info: useFormInitialization<AuctionFormInfo>(auctionFormInfoSchema, {
      title: '',
      description: '',
      tags: '',
    }),
    media: useFormInitialization<AuctionFormMedia>(auctionFormMediaSchema, {
      imageUrls: [],
    }),
    dateTime: useFormInitialization<AuctionFormDate>(auctionFormDateSchema, {
      dateTime: undefined,
    }),
    summary: useFormInitialization<AuctionFormComplete>(
      auctionFormSchemaComplete,
      {
        title: storedData?.title ?? '',
        description: storedData?.description ?? '',
        imageUrls: storedData?.imageUrls ?? [],
        dateTime: storedData?.dateTime ?? undefined,
      },
    ),
  };

  const { onSaveStep, onSaveSummaryStep } = useStepHandlers({
    updateStore,
    nextStep,
    postListing,
    clearStore,
    router,
  });

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
