import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { signIn } from 'next-auth/react';
import { useAnimation } from 'framer-motion';
import { ReactNode } from 'react';

// Mock dependencies
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  useAnimation: vi.fn(() => ({
    start: vi.fn(),
  })),
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LoginForm', () => {
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

    userEvent.type(emailInput, 'test@stud.noroff.no');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@stud.noroff.no',
        password: 'password123',
        redirect: false,
      });
    });
  });

  // it('displays error message when login fails', async () => {
  //   signIn.mockResolvedValue({ ok: false }); // Simulating a failed login attempt
  //   render(<LoginForm />);

  //   const emailInput = screen.getByPlaceholderText('your-email@stud.noroff.no');
  //   const passwordInput = screen.getByPlaceholderText('Password');
  //   userEvent.type(emailInput, 'wrong@stud.noroff.no');
  //   userEvent.type(passwordInput, 'wrongpassword');
  //   fireEvent.submit(screen.getByRole('button', { name: /login/i }));

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText('Email and password combination not found'),
  //     ).toBeInTheDocument();
  //   });
  // });

  // Additional tests can be written to cover other scenarios like animations, successful login, etc.
});
