import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MediaStepForm from './MediaStepForm';

import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import postListing from '@/lib/services/postListing';
import { vi } from 'vitest';

const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();

const storedDataMock = {
  imageUrls: [],
};

vi.mock('@/lib/hooks/useAuctionFormStore', () => ({
  default: vi.fn(() => ({
    updateStore: updateStoreMock,
    storedData: storedDataMock,
  })),
}));

vi.mock('@/lib/hooks/useAuctionFormStep', () => {
  return {
    default: vi.fn(() => ({
      getCurrentStep: vi.fn(),
    })),
  };
});

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
    currentStep: 'media' as 'info' | 'media' | 'time' | 'summary',
    getStore,
    clearStore,
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    prevStep: vi.fn(),
    postListing,
  };

  return <MediaStepForm {...props} />;
};

describe.skip('InfoStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form fields', () => {
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

  it('saves the step to the store', async () => {
    render(<StepWrapper />);
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(updateStoreMock).toHaveBeenCalled();
      expect(nextStepMock).toHaveBeenCalled();
    });
  });

  it('retrieves the stored data', async () => {
    const localStoredDataMock = {
      imageUrls: ['test1.jpg', 'test2.jpg', 'test3.jpg'],
    };

    vi.mocked(useAuctionFormStore).mockImplementation(() => ({
      updateStore: updateStoreMock,
      storedData: localStoredDataMock,
    }));

    render(<StepWrapper />);

    const images = screen.getAllByTestId(
      'draggable-image',
    ) as HTMLImageElement[];
    expect(images).toHaveLength(3);

    images.forEach((img, index) => {
      expect(img.src).toContain(localStoredDataMock.imageUrls[index]);
    });
  });
});
