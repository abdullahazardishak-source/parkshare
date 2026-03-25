'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load users');
        setUsers(json.users || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load users');
      }
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-1">
      <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-1" aria-label="Back to admin dashboard">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-7">Admin / Users</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-blue" />
            <p className="font-semibold text-gray-7">User management</p>
          </div>
          <Link href="/admin" className="text-sm font-semibold text-orange">
            Dashboard
          </Link>
        </Card>

        {users.map((user) => (
          <Card key={String(user.id || '')} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-7">{String(user.full_name || '')}</p>
              <p className="text-sm text-gray-4">{String(user.role || '')}</p>
            </div>
            <Badge variant={Boolean(user.is_verified) ? 'green' : 'orange'}>
              {Boolean(user.is_verified) ? 'verified' : 'pending'}
            </Badge>
          </Card>
        ))}
      </main>
    </div>
  );
}

