import { render, screen } from '@testing-library/react';

import { vi } from 'vitest';

import UserMenu from './UserMenu';

const mockSession = {
  data: {
    user: {
      avatar: 'https://avatar.com/avatar.png',
      name: 'test-user',
    },
  },
  status: 'authenticated',
};

vi.mock('next-auth/react', () => {
  return {
    useSession: () => ({
      ...mockSession,
    }),
  };
});

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<UserMenu />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the correct items when logged out', () => {
    mockSession.status = 'unauthenticated';

    render(<UserMenu />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
