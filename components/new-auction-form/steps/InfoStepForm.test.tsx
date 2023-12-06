import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoStepForm from './InfoStepForm';

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
    postListing,
  };

  return <InfoStepForm {...props} />;
};

describe('InfoStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepWrapper />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('saves the step to the store', async () => {
    render(<StepWrapper />);

    await userEvent.type(screen.getByPlaceholderText('Title'), 'Test Title');
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      'Test Description',
    );
    await userEvent.type(screen.getByPlaceholderText('Tags'), 'Test Tags');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalled();
      expect(updateStoreMock).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        tags: 'Test Tags',
      });
    });
  });

  it('displays error message if title is empty', async () => {
    render(<StepWrapper />);

    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      'Test Description',
    );
    await userEvent.type(screen.getByPlaceholderText('Tags'), 'Test Tags');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(
        screen.getByText('Title can not be shorter than 3 characters'),
      ).toBeInTheDocument();
    });
  });
});
