import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`))
      ?.slice(`${AUTH_COOKIE_NAME}=`.length);

    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifyAuthToken(token);
    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        full_name: payload.full_name,
        phone: payload.phone || '',
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

