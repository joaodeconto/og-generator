import { render, screen, fireEvent } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react'
import TextPanel from '../components/editor/panels/TextPanel'
import { useEditorStore } from '../lib/editorStore'

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
    render(<TextPanel />)
    const [titleInput] = screen.getAllByPlaceholderText('Your awesome title')
    const [subtitleInput] = screen.getAllByPlaceholderText('Short description')
    fireEvent.change(titleInput, { target: { value: 'Hello' } })
    fireEvent.change(subtitleInput, { target: { value: 'World' } })
    const state = useEditorStore.getState()
    expect(state.title).toBe('Hello')
    expect(state.subtitle).toBe('World')
  })

  it('adjusts font sizes via size buttons', () => {
    render(<TextPanel />)
    fireEvent.click(screen.getByText('XL'))
    const state = useEditorStore.getState()
    expect(state.titleFontSize).toBe(64)
    expect(state.subtitleFontSize).toBe(32)
  })

  it('applies balanced wrapping and clamped font sizes', () => {
    render(<TextPanel />)
    const titleInput = screen.getAllByPlaceholderText('Your awesome title')[1]
    const subtitleInput = screen.getAllByPlaceholderText('Short description')[1]
    expect(titleInput).toHaveStyle('text-wrap: balance')
    expect(titleInput).toHaveStyle('font-size: clamp(32px, 48px, 96px)')
    expect(subtitleInput).toHaveStyle('text-wrap: balance')
    expect(subtitleInput).toHaveStyle('font-size: clamp(16px, 24px, 48px)')
  })
})
