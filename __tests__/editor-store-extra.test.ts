import { useEditorStore, type EditorData } from '../lib/editorStore';

describe('editorStore new actions', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('toggles autoLayout and freezeSizeOnDrag', () => {
    expect(useEditorStore.getState().autoLayout).toBe(false);
    useEditorStore.getState().setAutoLayout(true);
    expect(useEditorStore.getState().autoLayout).toBe(true);
    const initialFreeze = useEditorStore.getState().freezeSizeOnDrag;
    useEditorStore.getState().toggleFreezeSizeOnDrag();
    expect(useEditorStore.getState().freezeSizeOnDrag).toBe(!initialFreeze);
  });

  it('loads a full design snapshot', () => {
    const snapshot: EditorData = {
      title: 'Loaded',
      subtitle: 'From API',
      titleFontSize: 42,
      subtitleFontSize: 21,
      titlePosition: { x: 10, y: 20 },
      subtitlePosition: { x: 30, y: 40 },
      theme: 'dark',
      layout: 'center',
      vertical: 'bottom',
      accentColor: '#ff0000',
      background: '#000000',
      width: 800,
      height: 418,
      bannerUrl: undefined,
      logoFile: undefined,
      logoUrl: undefined,
      logoPosition: { x: 80, y: 80 },
      logoScale: 1.2,
      invertLogo: true,
      removeLogoBg: false,
      maskLogo: true,
      presets: [],
      autoLayout: true,
      freezeSizeOnDrag: false,
    };
    useEditorStore.getState().loadDesign(snapshot);
    const state = useEditorStore.getState();
    expect(state.title).toBe('Loaded');
    expect(state.vertical).toBe('bottom');
    expect(state.autoLayout).toBe(true);
    expect(state.logoScale).toBeCloseTo(1.2);
  });
});

