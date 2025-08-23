import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

describe('HomePage', () => {
  it('renders the heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /og image studio/i })).toBeInTheDocument();
  });
});
