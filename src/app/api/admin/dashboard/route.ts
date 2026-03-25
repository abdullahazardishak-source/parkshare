import { NextResponse } from 'next/server';
import { getAdminDashboardData } from '@/lib/admin';

export async function GET() {
  try {
    const data = await getAdminDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load admin dashboard', detail: String(error) }, { status: 500 });
  }
}

