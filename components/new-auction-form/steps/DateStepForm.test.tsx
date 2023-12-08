import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateStepForm from './DateStepForm';

import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import postListing from '@/lib/services/postListing';
import { vi } from 'vitest';

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
  })),
}));

vi.mock('@/lib/hooks/usePostListing');

vi.mock('next/navigation', () => ({
  useNavigation: vi.fn(),
  redirect: vi.fn(),
  useRouter: vi.fn(),
}));

const StepWrapper = () => {
  const { getStore, clearStore } = useAuctionFormStore();

  const props = {
    mode: 'create' as 'create' | 'edit',
    listing: null,
    currentStep: 'info' as 'info' | 'media' | 'time' | 'summary',
    getStore,
    clearStore,
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    prevStep: vi.fn(),
    postListing,
  };

  return <DateStepForm {...props} />;
};

describe('InfoStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepWrapper />);

    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
