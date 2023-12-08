import { Step } from '@/components/new-auction-form/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const stepsOrder: Step[] = ['info', 'media', 'time', 'summary'];

const useAuctionFormStep = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getCurrentStep = useCallback(() => {
    let currentStep = searchParams.get('step') as Step | undefined;
    if (!currentStep || !stepsOrder.includes(currentStep)) {
      currentStep = 'info';
    }
    return currentStep;
  }, [searchParams]);

  const goToStep = useCallback(
    (step: Step) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('step', step);
      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams],
  );

  const nextStep = useCallback(() => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const nextIndex = currentIndex + 1;

    if (nextIndex < stepsOrder.length) {
      goToStep(stepsOrder[nextIndex]);
    }
  }, [getCurrentStep, goToStep]);

  const prevStep = useCallback(() => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      goToStep(stepsOrder[prevIndex]);
    }
  }, [getCurrentStep, goToStep]);

  return { goToStep, nextStep, prevStep, getCurrentStep };
};

export default useAuctionFormStep;
