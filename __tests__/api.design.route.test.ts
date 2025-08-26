import {
  useEditorStore,
  serializeEditorState,
  deserializeEditorState,
} from '../lib/editorStore';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    }),
  },
}));

describe('CRUD /api/design', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  afterEach(() => {
    const { __db } = require('../app/api/design/route');
    __db.clear();
  });

  it('creates and retrieves a design', async () => {
    const state = deserializeEditorState(
      serializeEditorState(useEditorStore.getState())
    );
    state.title = 'Saved';
    const { POST, GET } = await import('../app/api/design/route');
    const res = await POST({
      json: async () => state,
    } as Request);
    const { id } = await res.json();
    const getRes = await GET({
      url: `http://localhost/api/design?id=${id}`,
    } as Request);
    const fetched = await getRes.json();
    expect(fetched.title).toBe('Saved');
  });

  it('updates and deletes a design', async () => {
    const base = deserializeEditorState(
      serializeEditorState(useEditorStore.getState())
    );
    const { POST, GET, PUT, DELETE } = await import(
      '../app/api/design/route'
    );
    const created = await POST({
      json: async () => base,
    } as Request);
    const { id } = await created.json();
    base.title = 'Updated';
    await PUT({
      url: `http://localhost/api/design?id=${id}`,
      json: async () => base,
    } as Request);
    const after = await GET({
      url: `http://localhost/api/design?id=${id}`,
    } as Request);
    const fetched = await after.json();
    expect(fetched.title).toBe('Updated');
    await DELETE({
      url: `http://localhost/api/design?id=${id}`,
    } as Request);
    const missing = await GET({
      url: `http://localhost/api/design?id=${id}`,
    } as Request);
    expect(missing.status).toBe(404);
  });
});
