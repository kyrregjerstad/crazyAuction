import { Step } from '@/components/new-auction-form/types';
import { useRouter, useSearchParams } from 'next/navigation';

const useAuctionFormStep = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepsOrder: Step[] = ['info', 'media', 'time', 'summary'];

  const getCurrentStep = () => {
    let currentStep = searchParams.get('step') as Step | undefined;
    if (!currentStep || !stepsOrder.includes(currentStep)) {
      currentStep = 'info';
    }
    return currentStep;
  };

  const goToStep = (step: Step) => {
    router.push(`?step=${step}`);
  };

  const nextStep = () => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const nextIndex = currentIndex + 1;

    if (nextIndex < stepsOrder.length) {
      goToStep(stepsOrder[nextIndex]);
    }
  };

  const prevStep = () => {
    const currentIndex = stepsOrder.indexOf(getCurrentStep());
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      goToStep(stepsOrder[prevIndex]);
    }
  };

  return { goToStep, nextStep, prevStep, getCurrentStep };
};

export default useAuctionFormStep;
