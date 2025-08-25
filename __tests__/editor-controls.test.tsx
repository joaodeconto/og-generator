import { render, screen, fireEvent } from '@testing-library/react';
import EditorControls from '../components/EditorControls';
import { useEditorStore } from '../lib/editorStore';

describe('EditorControls', () => {
  beforeEach(() => {
    useEditorStore.setState({
      title: '',
      subtitle: '',
      theme: 'light',
      layout: 'left',
      accentColor: '#3b82f6',
      bannerUrl: undefined,
      logoUrl: undefined,
      logoPosition: { x: 0, y: 0 },
      logoScale: 1,
      invertLogo: false,
      removeLogoBg: false,
      maskLogo: false,
    });
  });

  it('updates store values based on user input', () => {
    render(<EditorControls />);

    fireEvent.change(screen.getByLabelText(/^título$/i), {
      target: { value: 'My Title' },
    });
    expect(useEditorStore.getState().title).toBe('My Title');

    fireEvent.change(screen.getByLabelText(/^subtítulo$/i), {
      target: { value: 'Subheading' },
    });
    expect(useEditorStore.getState().subtitle).toBe('Subheading');

    fireEvent.change(screen.getByLabelText(/tema/i), {
      target: { value: 'dark' },
    });
    expect(useEditorStore.getState().theme).toBe('dark');

    fireEvent.change(screen.getByLabelText(/layout/i), {
      target: { value: 'center' },
    });
    expect(useEditorStore.getState().layout).toBe('center');

    fireEvent.change(screen.getByLabelText(/logo x/i), {
      target: { value: '25' },
    });
    expect(useEditorStore.getState().logoPosition.x).toBe(25);

    fireEvent.change(screen.getByLabelText(/logo y/i), {
      target: { value: '75' },
    });
    expect(useEditorStore.getState().logoPosition.y).toBe(75);

    fireEvent.change(screen.getByLabelText(/escala do logo/i), {
      target: { value: '1.5' },
    });
    expect(useEditorStore.getState().logoScale).toBe(1.5);
  });
});
