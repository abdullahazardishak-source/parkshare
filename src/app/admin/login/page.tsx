'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('admin@parkshare.lk');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to sign in');
        return;
      }

      setUser(data.user);
      const target = redirectParam?.startsWith('/admin') ? redirectParam : '/admin';
      router.push(target);
    } catch {
      setError('Unable to reach server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-1 flex flex-col">
      <div className="bg-gradient-to-b from-orange to-orange-2 pt-6 pb-16 px-6 rounded-b-[40px]">
        <Link href="/" className="flex items-center gap-1 text-white/90 text-base mb-8">
          <ArrowLeft size={20} />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-white leading-tight">Admin Portal</h1>
        <p className="text-white/80 mt-3 text-base">Sign in with admin credentials</p>
      </div>

      <div className="flex-1 px-6 -mt-8">
        <form onSubmit={handleLogin} className="bg-white rounded-3xl p-6 shadow-card space-y-4">
          <Input
            label="Admin Email"
            type="email"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            icon={<Lock size={20} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          <p className="text-xs text-gray-4">Demo password: admin123</p>
          <Button fullWidth type="submit" isLoading={isLoading}>
            Sign In as Admin
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <AdminLoginContent />
    </Suspense>
  );
}

