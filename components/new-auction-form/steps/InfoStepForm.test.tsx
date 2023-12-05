import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoStepForm from './InfoStepForm';

import { vi } from 'vitest';

const nextStepMock = vi.fn();
const updateStoreMock = vi.fn();
const getStoreMock = vi.fn().mockReturnValue({
  title: 'test',
  description: '',
  tags: '',
});

vi.mock('@/lib/hooks/useAuctionFormStep', () => {
  return {
    default: vi.fn(() => ({
      getCurrentStep: vi.fn(),
      nextStep: nextStepMock,
    })),
  };
});

vi.mock('@/lib/hooks/useAuctionFormStore', () => {
  return {
    default: vi.fn(() => ({
      updateStore: updateStoreMock,
      getStore: getStoreMock,
      storedData: {
        title: 'test',
        description: '',
        tags: '',
      },
    })),
  };
});

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

describe('InfoStepForm', () => {
  it('renders form fields', () => {
    render(<InfoStepForm listing={null} />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tags')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('submits the form', async () => {
    render(<InfoStepForm listing={null} />);

    await userEvent.type(screen.getByPlaceholderText('Title'), 'Title');
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      'Description',
    );
    await userEvent.type(screen.getByPlaceholderText('Tags'), 'Tags');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    // fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(updateStoreMock).toHaveBeenCalled();
    });
  });

  it.skip('validates form fields', async () => {
    render(<InfoStepForm listing={null} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('Title'), '1');
    await userEvent.type(screen.getByPlaceholderText('Description'), '123');

    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    fireEvent.submit(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(
        screen.getByText('Title can not be shorter than 3 characters'),
      ).toBeInTheDocument();
    });
  });
});
