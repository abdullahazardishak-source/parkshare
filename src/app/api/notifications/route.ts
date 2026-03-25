import { NextResponse } from 'next/server';
import { getNotifications, markNotificationRead } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const notifications = await getNotifications(userId);
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load notifications', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const notification = await markNotificationRead(id);
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification', detail: String(error) }, { status: 500 });
  }
}

