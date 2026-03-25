import { NextResponse } from 'next/server';
import { getAdminUsers } from '@/lib/admin';

export async function GET() {
  try {
    const users = await getAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load users', detail: String(error) }, { status: 500 });
  }
}

