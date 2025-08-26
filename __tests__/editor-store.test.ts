import { useEditorStore } from '../lib/editorStore';

describe('editorStore position setters', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('updates title position', () => {
    useEditorStore.getState().setTitlePosition(10, 20);
    expect(useEditorStore.getState().titlePosition).toEqual({ x: 10, y: 20 });
  });

  it('updates subtitle position', () => {
    useEditorStore.getState().setSubtitlePosition(30, 40);
    expect(useEditorStore.getState().subtitlePosition).toEqual({ x: 30, y: 40 });
  });

  it('updates canvas size', () => {
    useEditorStore.getState().setSize(1600, 900);
    expect(useEditorStore.getState().width).toBe(1600);
    expect(useEditorStore.getState().height).toBe(900);
  });
});
