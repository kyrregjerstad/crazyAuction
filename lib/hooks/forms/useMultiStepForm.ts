import {
  type PostListing,
  type Step,
} from '@/components/new-auction-form/types';
import { ListingFull } from '@/lib/schemas/listingSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import {
  AuctionFormComplete,
  AuctionFormDate,
  AuctionFormInfo,
  AuctionFormMedia,
  auctionFormDateSchema,
  auctionFormInfoSchema,
  auctionFormMediaSchema,
  auctionFormSchemaComplete,
} from '@/lib/schemas/auctionSchema';
import {
  UpdateAuction,
  UpdateAuctionForm,
  updateAuctionSchema,
} from '@/lib/services/updateAuction';
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

const useFormInitialization = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues: DefaultValues<T>,
): UseFormReturn<T> => {
  return useForm({ resolver: zodResolver(schema), defaultValues });
};

type StepHandlersParams = {
  updateStore: (partialData: Partial<AuctionFormComplete>) => void;
  nextStep: () => void;
  postListing: PostListing;
  updateAuction: UpdateAuction;
  clearStore: () => void;
  router: AppRouterInstance;
  mode?: 'create' | 'edit';
  auctionId?: string;
};

const useStepHandlers = ({
  updateStore,
  nextStep,
  postListing,
  updateAuction,
  clearStore,
  router,
  mode = 'create',
  auctionId,
}: StepHandlersParams) => {
  const onSaveStep = async (data: Partial<AuctionFormComplete>) => {
    updateStore(data);
    nextStep();
  };

  const onSaveSummaryStep = async (formData: AuctionFormComplete) => {
    const res = await postListing({ formData });
    router.push(`/item/${res?.id}`);
    clearStore();
  };

  const onUpdateAuction = async (formData: UpdateAuctionForm) => {
    console.log('formData');
    const transformedFormData = {
      title: formData.title || undefined,
      description: formData.description || undefined,
      imageUrls: formData.imageUrls || undefined,
      tags: formData.tags || undefined,
    } satisfies UpdateAuctionForm;

    if (!auctionId) {
      console.error('No auction id provided');
      return;
    }

    const res = await updateAuction({
      formData: transformedFormData,
      id: auctionId,
    });

    console.log(res);
    router.push(`/item/${res?.id}`);
    clearStore();
    return res;
  };

  return { onSaveStep, onSaveSummaryStep, onUpdateAuction };
};

type Params = {
  mode?: 'create' | 'edit';
  nextStep: () => void;
  postListing: PostListing;
  updateAuction: UpdateAuction;
  currentStep: Step;
  auctionId?: string;
};

const useMultiStepAuctionForm = ({
  mode = 'create',
  nextStep,
  postListing,
  updateAuction,
  currentStep,
  auctionId,
}: Params) => {
  const router = useRouter();
  const { updateStore, clearStore, storedData } = useAuctionFormStore();

  const forms = {
    info: useFormInitialization<AuctionFormInfo>(auctionFormInfoSchema, {
      title: storedData.title ?? '',
      description: storedData.description ?? '',
      tags: storedData.tags ?? [],
    }),
    media: useFormInitialization<AuctionFormMedia>(auctionFormMediaSchema, {
      imageUrls: storedData.imageUrls ?? [],
    }),
    dateTime: useFormInitialization<AuctionFormDate>(auctionFormDateSchema, {
      dateTime: storedData.dateTime ?? undefined,
    }),
    summary: useFormInitialization<AuctionFormComplete>(
      auctionFormSchemaComplete,
      {
        title: storedData?.title ?? '',
        description: storedData?.description ?? '',
        tags: storedData?.tags ?? [],
        imageUrls: storedData?.imageUrls ?? [],
        dateTime: storedData?.dateTime ?? undefined,
      },
    ),
    update: useFormInitialization<UpdateAuctionForm>(updateAuctionSchema, {
      title: storedData?.title ?? undefined,
      description: storedData?.description ?? undefined,
      tags: storedData?.tags ?? undefined,
      imageUrls: storedData?.imageUrls ?? undefined,
    }),
  };

  const { onSaveStep, onSaveSummaryStep, onUpdateAuction } = useStepHandlers({
    updateStore,
    nextStep,
    postListing,
    updateAuction,
    clearStore,
    router,
    mode,
    auctionId,
  });

  const formHandlers = {
    info: forms.info.handleSubmit(onSaveStep),
    media: forms.media.handleSubmit(onSaveStep),
    time: forms.dateTime.handleSubmit(onSaveStep),
    summary: forms.summary.handleSubmit(onSaveSummaryStep),
    update: forms.update.handleSubmit((e) => console.log(e)),
  };

  const saveStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'edit' && currentStep === 'summary') {
      console.log(storedData);
      await formHandlers.update();
      return;
    }
    const handleFormSubmit = formHandlers[currentStep];
    if (handleFormSubmit) {
      await handleFormSubmit();
    }
  };

  return { ...forms, saveStep };
};

export default useMultiStepAuctionForm;
