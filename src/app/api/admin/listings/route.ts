import { NextResponse } from 'next/server';
import { getListings, updateListingStatus } from '@/lib/listings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const listings = await getListings({ status });
    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load listings', detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || '');
    const status = body?.status;
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    const listing = await updateListingStatus(id, status);
    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update listing status', detail: String(error) }, { status: 500 });
  }
}

