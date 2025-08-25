import { render, screen } from '@testing-library/react';
import AuthButtons from '../components/AuthButtons';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('AuthButtons', () => {
  it('renders loading placeholder with aria attributes', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'loading' } as any);
    render(<AuthButtons />);
    const loadingBtn = screen.getByRole('button', { name: /carregando/i });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
  });
});
