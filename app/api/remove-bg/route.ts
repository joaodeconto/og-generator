import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const form = await req.formData();
    const image = form.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const output = await removeBackground(image as any);

    return new NextResponse(output, {
      headers: {
        'Content-Type': (output as Blob).type || 'image/png'
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
