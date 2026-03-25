import { NextResponse } from 'next/server';
import { getListings } from '@/lib/listings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const district = searchParams.get('district') || undefined;
    const listings = await getListings({ city, district, status: 'approved' });
    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load listings', detail: String(error) }, { status: 500 });
  }
}

