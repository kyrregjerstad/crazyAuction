import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoStepForm from './InfoStepForm';

import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import { vi } from 'vitest';
import { FormStepProps } from '../types';
import { emptyListing } from '@/lib/mocks/data';

const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();
const storedDataMock = {
  title: '',
  description: '',
  tags: [],
};

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
    storedData: storedDataMock,
  })),
}));

vi.mock('@/lib/hooks/usePostListing');

vi.mock('next/navigation', () => ({
  useNavigation: vi.fn(),
  redirect: vi.fn(),
  useRouter: vi.fn(),
}));

const StepCreateWrapper = () => {
  const { getStore, clearStore } = useAuctionFormStore();

  const props = {
    mode: 'create' as 'create' | 'edit',
    listing: null,
    currentStep: 'info' as 'info' | 'media' | 'time' | 'summary',
    getStore,
    clearStore,
    prevStep: vi.fn(),
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    postListing: vi.fn(),
    updateAuction: vi.fn(),
  } satisfies FormStepProps;

  return <InfoStepForm {...props} />;
};

describe('InfoStepForm CREATE', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepCreateWrapper />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('saves the step to the store', async () => {
    render(<StepCreateWrapper />);

    await userEvent.type(screen.getByPlaceholderText('Title'), 'Test Title');
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      'Test Description',
    );
    await userEvent.type(screen.getByPlaceholderText('Tags'), 'tag1, tag2');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalled();
      expect(updateStoreMock).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
      });
    });
  });

  it('Retrieves the stored data', async () => {
    const localStoredDataMock = {
      title: 'Test Title',
      description: 'Test Description',
      tags: 'Test Tags',
    };

    vi.mocked(useAuctionFormStore).mockImplementation(() => ({
      updateStore: updateStoreMock,
      storedData: localStoredDataMock,
    }));

    render(<StepCreateWrapper />);

    expect(screen.getByPlaceholderText('Title')).toHaveValue('Test Title');
    expect(screen.getByPlaceholderText('Description')).toHaveValue(
      'Test Description',
    );
    expect(screen.getByPlaceholderText('Tags')).toHaveValue('Test Tags');
  });

  it('shows errors when the title field is empty', async () => {
    const localStoredDataMock = {
      title: '',
    };

    vi.mocked(useAuctionFormStore).mockImplementation(() => ({
      updateStore: updateStoreMock,
      storedData: localStoredDataMock,
    }));

    render(<StepCreateWrapper />);

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(
        screen.getByText('Title can not be shorter than 3 characters'),
      ).toBeInTheDocument();
    });
  });
});

const fetchedListingMock = {
  ...emptyListing,
  title: 'Test Title',
  description: 'Test Description',
  tags: ['tag1', 'tag2'],
};

const StepEditWrapper = () => {
  const { getStore, clearStore } = useAuctionFormStore();
  const props = {
    mode: 'edit' as 'create' | 'edit',
    listing: fetchedListingMock,
    currentStep: 'info' as 'info' | 'media' | 'time' | 'summary',
    getStore,
    clearStore,
    prevStep: vi.fn(),
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    postListing: vi.fn(),
    updateAuction: vi.fn(),
  } satisfies FormStepProps;

  return <InfoStepForm {...props} />;
};

describe('InfoStepForm EDIT', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<StepEditWrapper />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('populates the correct fields', async () => {
    const localStoredDataMock = {
      title: 'Test Title',
      description: undefined,
      tags: [],
    };

    vi.mocked(useAuctionFormStore).mockImplementation(() => ({
      updateStore: updateStoreMock,
      storedData: localStoredDataMock,
    }));

    render(<StepEditWrapper />);

    expect(screen.getByPlaceholderText('Title')).toHaveValue('Test Title');
    expect(screen.getByPlaceholderText('Description')).toHaveValue('');
    expect(screen.getByPlaceholderText('Tags')).toHaveValue('');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalled();
      expect(updateStoreMock).toHaveBeenCalledWith({
        title: 'Test Title',
        description: '',
        tags: [],
      });
    });
  });
});
