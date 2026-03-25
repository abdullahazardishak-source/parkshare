import { NextResponse } from 'next/server';
import { getAdminPayouts, updatePayoutStatus } from '@/lib/admin';

export async function GET() {
  try {
    const payouts = await getAdminPayouts();
    return NextResponse.json({ payouts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load payouts', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');
    const status = String(body?.status || '');
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    const payout = await updatePayoutStatus(id, status);
    return NextResponse.json({ payout });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payout', detail: String(error) }, { status: 500 });
  }
}

