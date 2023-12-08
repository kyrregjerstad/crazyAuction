import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryStepForm from './SummaryStepForm';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';

import postListing from '@/lib/services/postListing';
import { vi } from 'vitest';

const mockPostListing = vi.fn(() =>
  Promise.resolve({
    id: 'test-id',
    title: 'test title',
    description: 'test description',
    tags: ['test', 'tag'],
    media: [],
    created: 'test created',
    updated: 'test updated',
    endsAt: 'test endsAt',
  }),
);
const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();
const auctionFormData = {
  title: 'test title',
  description: 'test description',
  tags: ['test', 'tag'],
  dateTime: '2021-08-18T17:00:00.000Z',
  imageUrls: [],
  duration: 1,
  reservePrice: '1',
  startingBid: '1',
  image: 'test image',
  imagePreview: 'test image preview',
};

const mockGetStore = vi.fn(() => auctionFormData);
const mockClearStore = vi.fn();
const mockRouterPush = vi.fn();

let mockState = {
  storedData: auctionFormData,
  updateStore: (partialData: any) => {
    mockState = {
      ...mockState,
      storedData: { ...mockState.storedData, ...partialData },
    };
  },
  getStore: () => mockState.storedData,
  clearStore: () => {
    mockState = { ...mockState, storedData: {} as any };
  },
};

vi.mock('@/lib/hooks/useAuctionFormStep', () => {
  return {
    default: vi.fn(() => ({
      getCurrentStep: vi.fn(),
    })),
  };
});

vi.mock('@/lib/hooks/useStore', () => {
  return {
    default: vi.fn((store, callback) => {
      // Simulate the behavior of calling the store with a callback
      const state = { getStore: () => auctionFormData };
      return callback(state);
    }),
  };
});

vi.mock('@/lib/hooks/useAuctionFormStore', () => ({
  default: vi.fn(() => mockState),
}));

vi.mock('@/lib/hooks/usePostListing', () => {
  return {
    default: vi.fn(() => ({
      postListing: mockPostListing,
    })),
  };
});

vi.mock('next/navigation', () => ({
  useNavigation: vi.fn(),
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: mockRouterPush,
  })),
}));

const StepWrapper = () => {
  // const { getStore, clearStore } = useAuctionFormStore();

  const props = {
    mode: 'create' as 'create' | 'edit',
    listing: null,
    currentStep: 'summary' as 'info' | 'media' | 'time' | 'summary',
    getStore: mockGetStore,
    clearStore: mockClearStore,
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    prevStep: vi.fn(),
    postListing: mockPostListing,
  };

  return <SummaryStepForm {...props} />;
};

describe('SummaryStepForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the summary', () => {
    render(<StepWrapper />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
  });

  it('calls postListing on submit', async () => {
    render(<StepWrapper />);

    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(mockPostListing).toHaveBeenCalledTimes(1);
      // expect(mockPostListing).toHaveBeenCalledWith(auctionFormData);
    });
  });

  // it('redirects to the listing page on submit', async () => {
  //   render(<StepWrapper />);

  //   const submitBtn = screen.getByRole('button', { name: 'Submit' });

  //   await userEvent.click(submitBtn);

  //   fireEvent.submit(submitBtn);

  //   await waitFor(() => {
  //     expect(mockPostListing).toHaveBeenCalled();
  //     expect(mockRouterPush).toHaveBeenCalledTimes(1);
  //     expect(mockRouterPush).toHaveBeenCalledWith('/listings/test-id');
  //   });
  // });
});
