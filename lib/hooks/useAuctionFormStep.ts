import { Step } from '@/components/new-auction-form/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type Params = {
  mode: 'create' | 'edit';
};
const useAuctionFormStep = ({ mode }: Params) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const steps: { title: string; step: Step; description: string }[] = useMemo(
    () =>
      mode === 'create'
        ? [
            {
              title: 'Info',
              step: 'info',
              description:
                'Enter the title, description, and tags for your auction.',
            },
            {
              title: 'Media',
              step: 'media',
              description: 'Upload images for your auction.',
            },
            {
              title: 'Summary',
              step: 'summary',
              description: 'Review your auction details and submit.',
            },
          ]
        : [
            {
              title: 'Info',
              step: 'info',
              description:
                'Enter the title, description, and tags for your auction.',
            },
            {
              title: 'Media',
              step: 'media',
              description: 'Upload images for your auction.',
            },
            {
              title: 'Summary',
              step: 'summary',
              description: 'Review your auction details and submit.',
            },
          ],
    [mode],
  );

  const stepsOrder: Step[] = useMemo(() => {
    return mode === 'create'
      ? ['info', 'media', 'time', 'summary']
      : ['info', 'media', 'summary'];
  }, [mode]);

  const getCurrentStep = useCallback(() => {
    let currentStep = searchParams.get('step') as Step | undefined;
    if (!currentStep || !stepsOrder.includes(currentStep)) {
      currentStep = 'info';
    }
    return currentStep;
  }, [searchParams, stepsOrder]);

  const goToStep = useCallback(
    (step: Step) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('step', step);
      router.replace(`?${newSearchParams.toString()}`);
    },
    [router, searchParams],
  );

  const nextStep = useCallback(() => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const nextIndex = currentIndex + 1;

    if (nextIndex < stepsOrder.length) {
      goToStep(stepsOrder[nextIndex]);
    }
  }, [getCurrentStep, goToStep, stepsOrder]);

  const prevStep = useCallback(() => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      goToStep(stepsOrder[prevIndex]);
    }
  }, [getCurrentStep, goToStep, stepsOrder]);

  return { goToStep, nextStep, prevStep, getCurrentStep, steps };
};

export default useAuctionFormStep;
