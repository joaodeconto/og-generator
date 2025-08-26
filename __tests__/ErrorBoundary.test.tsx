import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { toast } from '../components/ToastProvider';

jest.mock('../components/ToastProvider', () => ({
  toast: jest.fn(),
}));

function Boom() {
  throw new Error('boom');
}

test('renders fallback on error', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary fallback={<div>fallback</div>}>
      <Boom />
    </ErrorBoundary>
  );
  expect(screen.getByText('fallback')).toBeInTheDocument();
  expect(toast).toHaveBeenCalled();
  spy.mockRestore();
});
