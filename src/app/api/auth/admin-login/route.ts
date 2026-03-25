import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createAuthToken, getAuthCookieOptions } from '@/lib/auth';
import type { Profile } from '@/types';
import { createServerClient } from '@/lib/supabase-server';

const ADMIN_EMAIL = 'admin@parkshare.lk';
const ADMIN_PASSWORD = 'admin123';

const adminUser: Profile = {
  id: 'admin-user-1',
  email: ADMIN_EMAIL,
  full_name: 'Admin User',
  phone: '+94770000000',
  nic: '199012345678',
  role: 'admin',
  is_verified: true,
  wallet_balance: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();

    const effectiveAdmin = (adminProfile as Profile | null) || adminUser;
    if (!adminProfile) {
      await supabase.from('profiles').upsert(adminUser, { onConflict: 'id' });
    }

    const token = await createAuthToken({
      sub: effectiveAdmin.id,
      role: effectiveAdmin.role,
      email: effectiveAdmin.email,
      full_name: effectiveAdmin.full_name,
      phone: effectiveAdmin.phone,
    });

    const response = NextResponse.json({ user: effectiveAdmin });
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to login as admin' }, { status: 500 });
  }
}

