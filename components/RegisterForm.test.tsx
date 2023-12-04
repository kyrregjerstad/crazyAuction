import { emptyRegisterResponse } from '@/lib/mocks/data';
import { postRegisterUser } from '@/lib/services/postSignUp';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { ReactNode } from 'react';
import { Mock } from 'vitest';
import RegisterForm from './RegisterForm';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('@/lib/services/postSignUp', () => ({
  postRegisterUser: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
  })),
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() })),
}));

vi.mock('react-rewards', () => ({
  useReward: vi.fn(() => ({ reward: vi.fn() })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils');
  return {
    ...actual,
    wait: () => Promise.resolve(),
  };
});

describe('LoginForm', () => {
  const signInMock = signIn as Mock;
  const postRegisterUserMock = postRegisterUser as Mock;

  it('renders the form', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Avatar Url')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Register' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
  });

  it('displays name errors', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText('Your name'), 'Test user');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(
      screen.getByText(
        'Name must not contain punctuation symbols apart from underscore (_).',
      ),
    ).toBeInTheDocument();
  });

  it('displays email errors', async () => {
    render(<RegisterForm />);
    await userEvent.type(
      screen.getByPlaceholderText('Your email'),
      'test@gmail.com',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(
      screen.getByText('Email must be a valid stud.noroff.no email address.'),
    ).toBeInTheDocument();
  });

  it('displays password errors', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText('Your password'), '1');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(
      screen.getByText('Password must be at least 8 characters.'),
    ).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText('Your password'),
      '12345678',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Repeat password'),
      '123456789',
    );

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByText(`Passwords don't match.`)).toBeInTheDocument();
  });

  it('simulates a successful registration', async () => {
    postRegisterUserMock.mockResolvedValue({
      ...emptyRegisterResponse,
      email: 'test@stud.noroff.no',
    });

    signInMock.mockResolvedValue({ url: '/' });

    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText('Your name'), 'Test_user');
    await userEvent.type(
      screen.getByPlaceholderText('Your email'),
      'test@stud.noroff.no',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Your password'),
      'password123',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Repeat password'),
      'password123',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Avatar Url'),
      'http://example.com/avatar.jpg',
    );

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText('Registered! 🎉')).toBeInTheDocument();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@stud.noroff.no',
        password: 'password123',
        callbackUrl: '/',
      });
    });
  });
});
