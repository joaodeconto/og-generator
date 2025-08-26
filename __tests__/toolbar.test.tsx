import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Toolbar from '../components/editor/Toolbar';
import { toast } from '../components/ToastProvider';

jest.mock('../components/ToastProvider', () => {
  const toast = jest.fn();
  return {
    toast,
    useToast: () => ({
      save: (msg = 'Saved') => toast({ message: msg }),
      exportImage: (msg = 'Exported') => toast({ message: msg }),
      error: (msg = 'Unexpected error') => toast({ message: msg, variant: 'error' }),
    }),
  };
});

const mockAddPreset = jest.fn();

jest.mock('../lib/editorStore', () => ({
  useEditorStore: jest.fn((selector?: any) => {
    const state = {
      undo: jest.fn(),
      redo: jest.fn(),
      addPreset: mockAddPreset,
      theme: 'light',
      layout: 'left',
      accentColor: '#000',
      title: 't',
      subtitle: 's',
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../lib/images', () => ({
  exportElementAsPng: jest.fn(),
}));

jest.mock('../lib/meta', () => ({
  copyMetaTags: jest.fn(),
}));

describe('Toolbar toasts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('shows toast on save', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(toast).toHaveBeenCalledWith({ message: 'Saved' });
  });

  it('shows toast on export success', async () => {
    const { exportElementAsPng } = require('../lib/images');
    exportElementAsPng.mockResolvedValue(undefined);
    document.body.innerHTML = '<div id="og-canvas"></div>';
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith({ message: 'Exported' }));
  });

  it('shows error toast on export failure', async () => {
    const { exportElementAsPng } = require('../lib/images');
    exportElementAsPng.mockRejectedValue(new Error('fail'));
    document.body.innerHTML = '<div id="og-canvas"></div>';
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({
        message: 'Failed to export image',
        variant: 'error',
      })
    );
  });
});
