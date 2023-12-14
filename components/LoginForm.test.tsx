import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { signIn } from 'next-auth/react';
import { ReactNode } from 'react';
import { Mock } from 'vitest';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(() => Promise.resolve({ ok: true, status: 200 })),
}));

vi.mock('framer-motion', () => ({
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
  })),
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const signInMock = signIn as Mock;

  it('renders email and password input fields', () => {
    render(<LoginForm />);

    expect(
      screen.getByPlaceholderText('your-email@stud.noroff.no'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('submits the form with email and password', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@stud.noroff.no');
    await userEvent.type(passwordInput, 'password123');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        email: 'test@stud.noroff.no',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('submits the form with email and password', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@noroff.no');
    await userEvent.type(passwordInput, 'password123');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        email: 'test@noroff.no',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('displays error message when login fails', async () => {
    signInMock.mockResolvedValue({ ok: false }); // Simulating a failed login attempt
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
    const passwordInput = screen.getByPlaceholderText('Password');
    await userEvent.type(emailInput, 'wrong@stud.noroff.no');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Email and password combination not found'),
      ).toBeInTheDocument();
    });
  });

  it('displays error message when email is not valid', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
    const passwordInput = screen.getByPlaceholderText('Password');
    await userEvent.type(emailInput, 'wrong@test.no');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Email must end with @noroff.no or @stud.noroff.no'),
      ).toBeInTheDocument();
    });
  });

  it('displays error message when password is too short', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
    const passwordInput = screen.getByPlaceholderText('Password');
    await userEvent.type(emailInput, 'wrong@stud.noroff.no');
    await userEvent.type(passwordInput, 'test');
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters long'),
      ).toBeInTheDocument();
    });
  });
});
