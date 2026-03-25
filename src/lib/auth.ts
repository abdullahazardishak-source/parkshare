import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import type { UserRole } from '@/types';

export const AUTH_COOKIE_NAME = 'parkshare-auth';
const DEFAULT_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  role: UserRole;
  email: string;
  full_name: string;
  phone?: string;
}

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
  return new TextEncoder().encode(secret);
};

const parseExpirySeconds = () => {
  const envValue = process.env.JWT_EXPIRES_IN?.trim();
  if (!envValue) return DEFAULT_EXPIRES_SECONDS;
  const num = Number(envValue);
  if (Number.isFinite(num) && num > 0) return Math.floor(num);
  return DEFAULT_EXPIRES_SECONDS;
};

export const createAuthToken = async (payload: AuthTokenPayload) => {
  const expiresInSeconds = parseExpirySeconds();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(getSecretKey());
};

export const verifyAuthToken = async (token: string) => {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ['HS256'],
  });

  return payload as unknown as AuthTokenPayload & { exp?: number; iat?: number };
};

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: parseExpirySeconds(),
});

