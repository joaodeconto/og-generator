import { render, screen, fireEvent } from '@testing-library/react';
import TextPanel from '../components/editor/panels/TextPanel';
import { useEditorStore } from '../lib/editorStore';

describe('TextPanel', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
    useEditorStore.setState({
      title: '',
      subtitle: '',
      titleFontSize: 48,
      subtitleFontSize: 24,
    });
  });

  it('updates title and subtitle in the store', () => {
    render(<TextPanel />);
    fireEvent.change(screen.getByPlaceholderText('Your awesome title'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByPlaceholderText('Short description'), { target: { value: 'World' } });
    const state = useEditorStore.getState();
    expect(state.title).toBe('Hello');
    expect(state.subtitle).toBe('World');
  });

  it('adjusts font sizes via size buttons', () => {
    render(<TextPanel />);
    fireEvent.click(screen.getByText('XL'));
    const state = useEditorStore.getState();
    expect(state.titleFontSize).toBe(64);
    expect(state.subtitleFontSize).toBe(32);
  });

  it('applies balanced wrapping and clamped font sizes', () => {
    render(<TextPanel />);
    const titleInput = screen.getByPlaceholderText('Your awesome title');
    const subtitleInput = screen.getByPlaceholderText('Short description');
    expect(titleInput).toHaveStyle('text-wrap: balance');
    expect(titleInput).toHaveStyle('font-size: clamp(32px, 48px, 96px)');
    expect(subtitleInput).toHaveStyle('text-wrap: balance');
    expect(subtitleInput).toHaveStyle('font-size: clamp(16px, 24px, 48px)');
  });
});
