import { NextResponse } from 'next/server';
import { getAdminComplaints, updateComplaintStatus } from '@/lib/admin';

export async function GET() {
  try {
    const complaints = await getAdminComplaints();
    return NextResponse.json({ complaints });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load complaints', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');
    const status = String(body?.status || '');
    const resolution = body?.resolution ? String(body.resolution) : undefined;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    const complaint = await updateComplaintStatus(id, status, resolution);
    return NextResponse.json({ complaint });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update complaint', detail: String(error) }, { status: 500 });
  }
}

