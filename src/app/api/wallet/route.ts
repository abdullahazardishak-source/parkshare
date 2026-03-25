import { NextResponse } from 'next/server';
import { getWalletTransactions } from '@/lib/wallet';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const transactions = await getWalletTransactions(userId);
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load wallet transactions', detail: String(error) }, { status: 500 });
  }
}

