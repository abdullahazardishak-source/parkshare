import { NextResponse } from 'next/server';
import { getBookings } from '@/lib/bookings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId') || undefined;
    const status = searchParams.get('status') || undefined;
    const bookings = await getBookings({ driverId, status });
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load bookings', detail: String(error) }, { status: 500 });
  }
}

