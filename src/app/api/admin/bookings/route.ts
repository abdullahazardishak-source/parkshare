import { NextResponse } from 'next/server';
import { getBookings, updateBookingStatus } from '@/lib/bookings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const bookings = await getBookings({ status });
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load bookings', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');
    const status = body?.status;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    const booking = await updateBookingStatus(id, status);
    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking status', detail: String(error) }, { status: 500 });
  }
}

