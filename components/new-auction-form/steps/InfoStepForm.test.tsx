import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoStepForm from './InfoStepForm';

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import postListing from '@/lib/services/postListing';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { vi } from 'vitest';

const saveStepMock = vi.fn((e: FormEvent<HTMLFormElement>) =>
  Promise.resolve(),
);

const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();

vi.mock('@/lib/hooks/useAuctionFormStep', () => {
  return {
    default: vi.fn(() => ({
      getCurrentStep: vi.fn(),
      nextStep: nextStepMock,
    })),
  };
});

vi.mock('@/lib/hooks/useAuctionFormStore', () => ({
  default: vi.fn(() => ({
    getStore: vi.fn().mockReturnValue({
      title: 'test',
      description: '',
      tags: '',
    }),
    updateStore: updateStoreMock,
    clearStore: vi.fn(),
    storedData: {
      title: 'test',
      description: '',
      tags: '',
    },
  })),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: '',
        accessToken: '123',
      },
    },
  })),
}));
vi.mock('@/lib/hooks/usePostListing');

vi.mock('next/navigation', () => ({
  useNavigation: vi.fn(),
  redirect: vi.fn(),
  useRouter: vi.fn(),
}));

const StepWrapper = () => {
  const router = useRouter();
  const { getCurrentStep, nextStep } = useAuctionFormStep();
  const { getStore, updateStore, clearStore } = useAuctionFormStore();

  const modifiedUpdateStore = updateStoreMock;

  const hookDependencies = {
    getStore,
    updateStore,
    clearStore,
    nextStep,
    postListing,
    router,
    getCurrentStep,
  };

  const { info, saveStep } = useMultiStepAuctionForm(
    {
      mode: 'create',
      listing: null,
    },
    hookDependencies,
  );

  const modifiedSaveStep = saveStepMock;

  return (
    <InfoStepForm listing={null} form={info} saveStep={modifiedSaveStep} />
  );
};

describe('InfoStepForm', () => {
  it('renders form fields', () => {
    render(<StepWrapper />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('submits the form', async () => {
    render(<StepWrapper />);

    await userEvent.type(screen.getByPlaceholderText('Title'), 'Title');
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      'Description',
    );
    await userEvent.type(screen.getByPlaceholderText('Tags'), 'Tags');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(saveStepMock).toHaveBeenCalled();
    });
  });
});
