import { NextResponse } from 'next/server';
import { getAdminSettings, upsertAdminSetting } from '@/lib/admin';

export async function GET() {
  try {
    const settings = await getAdminSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings', detail: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const key = String(body?.key || '');
    const value = body?.value;
    if (!key) return NextResponse.json({ error: 'key is required' }, { status: 400 });
    const setting = await upsertAdminSetting(key, value ?? {});
    return NextResponse.json({ setting });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save setting', detail: String(error) }, { status: 500 });
  }
}

