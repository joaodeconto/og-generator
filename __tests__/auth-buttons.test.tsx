import { fireEvent, render, screen } from '@testing-library/react';
import AuthButtons from '../components/AuthButtons';
import { useSession, signIn, signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe('AuthButtons', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders loading placeholder with aria attributes', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'loading' } as any);
    render(<AuthButtons />);
    const loadingBtn = screen.getByRole('button', { name: /carregando/i });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
  });

  it('triggers signIn when clicking Entrar', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' } as any);
    render(<AuthButtons />);
    const signInBtn = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(signInBtn);
    expect(mockedSignIn).toHaveBeenCalled();
  });

  it('shows avatar dropdown and calls signOut', async () => {
    mockedUseSession.mockReturnValue({
      data: { user: { name: 'Alice', image: 'avatar.png' } },
      status: 'authenticated',
    } as any);
    render(<AuthButtons />);
    const avatarImg = screen.getByRole('img', { name: /alice/i });
    expect(avatarImg).toBeInTheDocument();
    fireEvent.click(avatarImg.closest('button')!);
    const signOutBtn = await screen.findByRole('menuitem', { name: /sair/i });
    fireEvent.click(signOutBtn);
    expect(mockedSignOut).toHaveBeenCalled();
  });
});
