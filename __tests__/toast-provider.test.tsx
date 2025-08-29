import { act, render, screen } from '@testing-library/react';
import ToastProvider, { toast, useToast } from '../components/ToastProvider';
import { useEffect } from 'react';

function Caller() {
  const { save, error } = useToast();
  useEffect(() => {
    save('Saved ok');
    error('Oops');
  }, [save, error]);
  return null;
}

describe('ToastProvider', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('displays and auto-dismisses a toast', async () => {
    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );
    await Promise.resolve();
    await act(async () => {
      toast({ message: 'Hello' });
    });
    expect(await screen.findByText('Hello')).toBeInTheDocument();
    // advance time to auto-dismiss
    await Promise.resolve();
    await act(async () => {
      jest.advanceTimersByTime(4100);
    });
    expect(screen.queryByText('Hello')).toBeNull();
  });

  it('supports helper variants via toast()', async () => {
    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );
    await act(async () => {
      toast({ message: 'Saved ok' });
      toast({ message: 'Oops', variant: 'error' });
    });
    expect(await screen.findByText('Saved ok')).toBeInTheDocument();
    expect(await screen.findByText('Oops')).toBeInTheDocument();
  });
});
