import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createAuthToken, getAuthCookieOptions } from '@/lib/auth';
import type { Profile } from '@/types';
import { createServerClient } from '@/lib/supabase-server';

const TEST_OTP = '123456';

const buildFallbackUser = (phone: string): Profile => ({
  id: 'demo-user-1',
  email: 'demo@parkshare.lk',
  full_name: 'Demo User',
  phone: `+94${phone}`,
  nic: '199012345678',
  role: 'driver',
  is_verified: true,
  wallet_balance: 5000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = String(body?.phone || '').replace(/\D/g, '');
    const otp = String(body?.otp || '');

    if (phone.length < 9) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (otp !== TEST_OTP) {
      return NextResponse.json({ error: `Invalid OTP. Use test OTP: ${TEST_OTP}` }, { status: 401 });
    }

    const supabase = createServerClient();
    let user: Profile;
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', `+94${phone}`)
      .limit(1)
      .maybeSingle();

    if (existingUser) {
      user = existingUser as Profile;
    } else {
      user = buildFallbackUser(phone);
      await supabase.from('profiles').upsert(user, { onConflict: 'id' });
    }
    const token = await createAuthToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
    });

    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

