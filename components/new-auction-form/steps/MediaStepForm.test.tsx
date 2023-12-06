import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MediaStepForm from './MediaStepForm';

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

vi.mock('react-dom', () => ({
  useFormStatus: vi.fn(() => ({
    pending: false,
    data: null,
    method: 'POST',
  })),
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
    postListing,
  };

  return <MediaStepForm {...props} />;
};

describe('InfoStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepWrapper />);

    expect(
      screen.getByText('Drag & drop files here, or click to select files'),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it.skip('saves the step to the store', async () => {
    render(<StepWrapper />);
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(updateStoreMock).toHaveBeenCalled();
      expect(nextStepMock).toHaveBeenCalled();
    });
  });
});
