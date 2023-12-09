import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryStepForm from './SummaryStepForm';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';

import postListing from '@/lib/services/postListing';
import { vi } from 'vitest';
import { FormStepProps } from '../types';
import updateAuction from '@/lib/services/updateAuction';

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

const mockUpdateAuction = vi.fn(() =>
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
    default: vi.fn((_store, callback) => {
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

const CreateStepWrapper = () => {
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
    updateAuction: mockUpdateAuction,
  } satisfies FormStepProps;

  return <SummaryStepForm {...props} />;
};

describe('SummaryStepForm CREATE', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the summary', () => {
    render(<CreateStepWrapper />);

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
    render(<CreateStepWrapper />);

    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(mockPostListing).toHaveBeenCalledTimes(1);
      // expect(mockPostListing).toHaveBeenCalledWith(auctionFormData);
    });
  });
});

const EditStepWrapper = () => {
  const props = {
    mode: 'edit' as 'create' | 'edit',
    listing: null,
    currentStep: 'summary' as 'info' | 'media' | 'time' | 'summary',
    getStore: mockGetStore,
    clearStore: mockClearStore,
    updateStore: updateStoreMock,
    nextStep: nextStepMock,
    prevStep: vi.fn(),
    postListing: mockPostListing,
    updateAuction: mockUpdateAuction,
  } satisfies FormStepProps;

  return <SummaryStepForm {...props} />;
};

describe('SummaryStepForm EDIT', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the summary', () => {
    render(<EditStepWrapper />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Update' })).not.toBeDisabled();
  });

  it.skip('calls updateAuction on submit', async () => {
    render(<EditStepWrapper />);

    const submitBtn = screen.getByRole('button', { name: 'Update' });

    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(mockUpdateAuction).toHaveBeenCalledTimes(1);
      expect(mockUpdateAuction).toHaveBeenCalledWith(auctionFormData);
    });
  });
});
