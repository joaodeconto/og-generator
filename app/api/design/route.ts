import { NextResponse } from 'next/server';
import { serializeEditorState, deserializeEditorState, EditorData } from '../../../lib/editorStore';
import { randomUUID } from 'crypto';

const db = new Map<string, string>();
export const __db = db;

export async function POST(req: Request) {
  const data = (await req.json()) as EditorData;
  const id = randomUUID();
  db.set(id, serializeEditorState(data));
  return NextResponse.json({ id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const raw = db.get(id);
  if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(deserializeEditorState(raw));
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (!db.has(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = (await req.json()) as EditorData;
  db.set(id, serializeEditorState(data));
  return NextResponse.json({ id });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (!db.has(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.delete(id);
  return NextResponse.json({ ok: true });
}
