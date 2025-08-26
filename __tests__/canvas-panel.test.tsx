import { render, screen, fireEvent } from '@testing-library/react'
import CanvasPanel from '../components/editor/panels/CanvasPanel'
import { useEditorStore } from '../lib/editorStore'

describe('CanvasPanel', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  it('updates background color in the store', () => {
    render(<CanvasPanel />)
    const input = screen.getByLabelText('Background Color') as HTMLInputElement
    fireEvent.change(input, { target: { value: '#123456' } })
    expect(useEditorStore.getState().background).toBe('#123456')
  })

  it('changes canvas size via presets', () => {
    render(<CanvasPanel />)
    fireEvent.click(screen.getByRole('button', { name: /1600 by 900/i }))
    expect(useEditorStore.getState().width).toBe(1600)
    expect(useEditorStore.getState().height).toBe(900)
  })
})
