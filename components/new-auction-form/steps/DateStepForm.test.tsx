import { render, screen } from '@testing-library/react';
import DateStepForm from './DateStepForm';

import useAuctionFormStore, {
  StoredData,
} from '@/lib/hooks/useAuctionFormStore';
import { vi } from 'vitest';
import { createStoredDataMock } from '@/lib/mocks/data';
import { FormStepProps } from '../types';

const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();

vi.mock('@/lib/hooks/useAuctionFormStep', () => {
  return {
    default: vi.fn(() => ({
      getCurrentStep: vi.fn(),
    })),
  };
});

vi.mock('@/lib/hooks/useAuctionFormStore', () => ({
  default: vi.fn(() => ({
    updateStore: updateStoreMock,
    storedData: {
      endDate: '',
      endTime: '',
    },
  })),
}));

vi.mock('@/lib/hooks/usePostListing');

vi.mock('next/navigation', () => ({
  useNavigation: vi.fn(),
  redirect: vi.fn(),
  useRouter: vi.fn(),
}));

type Props = {
  storedDataProp?: StoredData;
  mode?: 'create' | 'edit';
};

const StepWrapper = ({
  storedDataProp = createStoredDataMock(),
  mode = 'create',
}: Props) => {
  const { getStore, clearStore } = useAuctionFormStore();

  const props = {
    mode,
    listing: null,
    currentStep: 'info' as 'info' | 'media' | 'time' | 'summary',
    getStore,
    clearStore,
    prevStep: vi.fn(),
    storedData: storedDataProp,
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    postListing: vi.fn(),
    updateAuction: vi.fn(),
  } satisfies FormStepProps;

  return <DateStepForm {...props} />;
};

describe('InfoStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepWrapper />);

    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
